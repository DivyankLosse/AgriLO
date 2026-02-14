import React from 'react';

const symptomsList = [
    "Wilting",
    "Yellowing",
    "Stunted Growth",
    "Rotten Smell",
    "Black Roots",
    "Mushy Roots",
    "Knots on Roots",
    "Dry Brittle Roots",
    "Brown Tips",
    "Leaf Drop"
];

const SymptomChecklist = ({ selectedSymptoms, onChange }) => {

    const handleCheckboxChange = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            onChange(selectedSymptoms.filter(s => s !== symptom));
        } else {
            onChange([...selectedSymptoms, symptom]);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {symptomsList.map((symptom) => (
                <label key={symptom} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom)}
                        onChange={() => handleCheckboxChange(symptom)}
                        style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '1rem' }}>{symptom}</span>
                </label>
            ))}
        </div>
    );
};

export default SymptomChecklist;
