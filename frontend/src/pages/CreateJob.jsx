
import React, { useEffect, useState } from "react";
import axios from "axios";
import { createJob } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: "",
    type: "",
    company: "",
    experience: "",
    salary: "",
    vacancies: "",
    address: "",
    skills: "",
    description: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/company/all"
        );

        setCompanies(res.data.companies || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        salary: Number(formData.salary),
        vacancies: Number(formData.vacancies),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const res = await createJob(payload);

      alert(res.data.message);

      navigate("/jobs");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

        <h2 className="text-3xl font-bold mb-2">
          Create New Job
        </h2>

        <p className="text-gray-500 mb-8">
          Fill in the details to publish a job.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Job Title
            </label>

            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Frontend Developer"
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Job Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
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
            <label className="block mb-2 font-medium">
              Select Company
            </label>

            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            >
              <option value="">Select Company</option>

              {companies.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.companyName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-2 font-medium">
                Experience
              </label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="2-3 Years"
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Salary
              </label>

              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="50000"
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>

          </div>

          <div>
            <label className="block mb-2 font-medium">
              Vacancies
            </label>

            <input
              type="number"
              name="vacancies"
              value={formData.vacancies}
              onChange={handleChange}
              placeholder="5"
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Job Address
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Surat, Gujarat"
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="w-full border p-3 rounded-lg"
              required
            />

            <p className="text-sm text-gray-500 mt-1">
              Separate skills using commas.
            </p>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Job Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Enter job description..."
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateJob;
