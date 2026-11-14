
import { useEffect, useState } from "react";

const JobForm = ({
  initialData,
  companies,
  onSubmit,
  buttonText,
}) => {
  console.log("Companies:", companies);
console.log("Initial Data:", initialData);

  const [formData, setFormData] = useState({
    jobTitle: initialData?.jobTitle || "",
    type: initialData?.type || "",
    company: initialData?.company?._id || initialData?.company || "",
    experience: initialData?.experience || "",
    salary: initialData?.salary ?? "",
    vacancies: initialData?.vacancies ?? "",
    address: initialData?.address || "",
    skills: Array.isArray(initialData?.skills)
      ? initialData.skills.join(", ")
      : initialData?.skills || "",
    description: initialData?.description || "",
  });
console.log("initial data",initialData);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      salary: Number(formData.salary),
      vacancies: formData.vacancies === ""
        ? undefined
        : Number(formData.vacancies),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block font-semibold mb-2">Job Title</label>
        <input
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="Frontend Developer"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Job Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={inputClass}
          required
        >
          <option value="">Select Job Type</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      <div>
  <label className="block font-semibold mb-2">
    Company
  </label>

  <select
    name="company"
    value={formData.company}
    onChange={handleChange}
    className={inputClass}
    required
  >
    <option value="">Select Company</option>

    {Array.isArray(companies) &&
      companies.map((company) => (
        <option key={company._id} value={company._id}>
          {company.companyName}
        </option>
      ))}
  </select>

  {companies?.length === 0 && (
    <p className="text-red-500 text-sm mt-1">
      No companies found.
    </p>
  )}
</div>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block font-semibold mb-2">Experience</label>
          <input
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="2-3 Years"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Salary</label>
          <input
            type="number"
            min="0"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="50000"
            className={inputClass}
            required
          />
        </div>

      </div>

      <div>
        <label className="block font-semibold mb-2">Vacancies</label>
        <input
          type="number"
          min="0"
          name="vacancies"
          value={formData.vacancies}
          onChange={handleChange}
          placeholder="5"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Address</label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Surat, Gujarat"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Skills</label>
        <input
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
          className={inputClass}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Separate skills with commas.
        </p>
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Job Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          placeholder="Describe the job responsibilities..."
          className={inputClass}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
      >
        {buttonText}
      </button>

    </form>
  );
};

export default JobForm;
