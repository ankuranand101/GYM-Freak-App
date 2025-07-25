import React, { useState } from 'react';

const dummyParsedResume = {
  name: "John Doe",
  summary: "Experienced developer...",
  experience: [
    { company: "Company A", role: "Developer", years: "2018-2020" }
  ],
  education: [
    { school: "University X", degree: "BSc Computer Science", year: "2017" }
  ],
  skills: ["JavaScript", "React", "Python"]
};

function ResumeEditor() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  // Upload and parse resume file
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      alert('Please upload a .pdf or .docx file');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://localhost:8000/parse-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        alert('Error parsing file: ' + data.error);
      } else {
        setResume(data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setResume(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...resume[field]];
    updatedArray[index][key] = value;
    setResume(prev => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayEntry = (field, entry) => {
    setResume(prev => ({ ...prev, [field]: [...prev[field], entry] }));
  };

  const removeArrayEntry = (field, index) => {
    const updatedArray = [...resume[field]];
    updatedArray.splice(index, 1);
    setResume(prev => ({ ...prev, [field]: updatedArray }));
  };

  const enhanceSection = async (section) => {
    if (!resume) return;
    setLoading(true);
    try {
      let contentToSend;
      // For array sections, join or stringify appropriately
      if (Array.isArray(resume[section])) {
        if (section === 'skills') {
          contentToSend = resume[section].join(', ');
        } else {
          // For experience, education, stringify array of objects
          contentToSend = JSON.stringify(resume[section]);
        }
      } else if (typeof resume[section] === 'object') {
        contentToSend = JSON.stringify(resume[section]);
      } else {
        contentToSend = resume[section];
      }

      console.log('Sending to AI enhance:', { section, content: contentToSend });

      const response = await fetch('http://localhost:8000/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, content: contentToSend }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('Received from AI enhance:', data);

      // Update resume section based on type
      if (section === 'skills') {
        // For skills, split enhanced string back to array
        const enhancedSkills = data.enhanced_content.replace(' (enhanced by AI)', '').split(',').map(s => s.trim());
        setResume(prev => ({ ...prev, skills: enhancedSkills }));
      } else if (section === 'experience' || section === 'education') {
        // For these, keep original as enhancement is mocked
        alert('Enhancement for this section is mocked and not applied.');
      } else {
        // For string sections like name, summary
        setResume(prev => ({ ...prev, [section]: data.enhanced_content }));
      }
    } catch (error) {
      console.error('Error enhancing section:', error);
      alert('Error enhancing section');
    }
    setLoading(false);
  };

  const saveResume = async () => {
    if (!resume) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/save-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: resume }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Error saving resume');
    }
    setLoading(false);
  };

  const downloadResume = () => {
    if (!resume) return;
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(resume, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "resume.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!resume) {
    return (
      <div className="file-upload-container">
        <input type="file" accept=".pdf,.docx" onChange={handleUpload} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={resume.name}
          onChange={e => handleChange('name', e.target.value)}
        />
        <button onClick={() => enhanceSection('name')} disabled={loading}>Enhance with AI</button>
      </div>

      <div>
        <label>Summary: </label>
        <textarea
          value={resume.summary}
          onChange={e => handleChange('summary', e.target.value)}
        />
        <button onClick={() => enhanceSection('summary')} disabled={loading}>Enhance with AI</button>
      </div>

      <div>
        <h3>Experience</h3>
        {resume.experience.map((exp, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={e => handleArrayChange('experience', idx, 'company', e.target.value)}
              style={{ flex: '1 1 150px', minWidth: '120px' }}
            />
            <input
              type="text"
              placeholder="Role"
              value={exp.role}
              onChange={e => handleArrayChange('experience', idx, 'role', e.target.value)}
              style={{ flex: '1 1 150px', minWidth: '120px' }}
            />
            <input
              type="text"
              placeholder="Years"
              value={exp.years}
              onChange={e => handleArrayChange('experience', idx, 'years', e.target.value)}
              style={{ flex: '1 1 100px', minWidth: '80px' }}
            />
            <button onClick={() => removeArrayEntry('experience', idx)} disabled={loading}>Remove</button>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button onClick={() => addArrayEntry('experience', { company: '', role: '', years: '' })} disabled={loading}>Add Experience</button>
          <button onClick={() => enhanceSection('experience')} disabled={loading}>Enhance with AI</button>
        </div>
      </div>

      <div>
        <h3>Education</h3>
        {resume.education.map((edu, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="School"
              value={edu.school}
              onChange={e => handleArrayChange('education', idx, 'school', e.target.value)}
              style={{ flex: '1 1 150px', minWidth: '120px' }}
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={e => handleArrayChange('education', idx, 'degree', e.target.value)}
              style={{ flex: '1 1 150px', minWidth: '120px' }}
            />
            <input
              type="text"
              placeholder="Year"
              value={edu.year}
              onChange={e => handleArrayChange('education', idx, 'year', e.target.value)}
              style={{ flex: '1 1 100px', minWidth: '80px' }}
            />
            <button onClick={() => removeArrayEntry('education', idx)} disabled={loading}>Remove</button>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button onClick={() => addArrayEntry('education', { school: '', degree: '', year: '' })} disabled={loading}>Add Education</button>
          <button onClick={() => enhanceSection('education')} disabled={loading}>Enhance with AI</button>
        </div>
      </div>
      <div>
        <h3>Skills</h3>
        {resume.skills.map((skill, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={skill}
              onChange={e => {
                const newSkills = [...resume.skills];
                newSkills[idx] = e.target.value;
                setResume(prev => ({ ...prev, skills: newSkills }));
              }}
            />
            <button onClick={() => {
              const newSkills = [...resume.skills];
              newSkills.splice(idx, 1);
              setResume(prev => ({ ...prev, skills: newSkills }));
            }} disabled={loading}>Remove</button>
          </div>
        ))}
        <button onClick={() => setResume(prev => ({ ...prev, skills: [...prev.skills, ''] }))} disabled={loading}>Add Skill</button>
        <button onClick={() => enhanceSection('skills')} disabled={loading}>Enhance with AI</button>
      </div>

      <div className="button-container">
        <button onClick={saveResume} disabled={loading}>Save Resume</button>
        <button onClick={downloadResume} disabled={loading}>Download Resume JSON</button>
      </div>
    </div>
  );
}

export default ResumeEditor;
