function chunker(patients) {

    const chunk = [];
    patients.forEach(patient => {
        const { id, name, age } = patient;

        const header = `Patient ID: ${id}, Name: ${name}, Age: ${age}`;

        if (patient.presenting_symptoms.length > 0) {
            const symptoms = patient.presenting_symptoms.join(', ');
            chunk.push(`${header} | Section: Symptoms \n ${symptoms}`);

        }

        if(patient.consultation_history.length > 0) {
            const consultations = patient.consultation_history.map(consult => {
                return `Date: ${consult.date}, Facility: ${consult.facility}, Notes: ${consult.notes}`;
            }).join('\n');

            chunk.push(`${header} | Section: Consultation History \n${consultations}`);
        }

        if(patient.lifestyle_notes) {
            const lifestyle = `Lifestyle Notes: ${patient.lifestyle_notes}`;
            chunk.push(`${header} | Section: Lifestyle Notes \n${lifestyle}`);
        }

        if (patient.current_treatment_plan) {
            const treatmentPlan = `Current Treatment Plan: ${patient.current_treatment_plan}`;
            chunk.push(`${header} | Section: Current Treatment Plan \n${treatmentPlan}`);
        }

    });

    return chunk;
}
export default chunker;