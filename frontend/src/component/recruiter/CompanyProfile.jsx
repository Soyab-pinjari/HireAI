
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  BriefcaseBusiness,
  Calendar,

  Save,
  Loader2,
  ImagePlus,
} from "lucide-react";

const initialForm = {
  companyName: "",
  companyEmail: "",
  phone: "",
  website: "",
  profileImage: "",
  industry: "",
  companySize: "1-10",
  foundedYear: "",
  description: "",
  country: "India",
  state: "",
  city: "",
  pincode: "",
  linkedin: "",
  twitter: "",
};

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";
const InputField = ({
  label,
  name,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>

    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder || label}
        className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
          Icon ? "pl-10" : ""
        }`}
      />
    </div>
  </div>
);

  const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="mb-6 flex items-start gap-3">
      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
        <Icon size={21} />
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );


const CompanyProfile = () => {
  const [formData, setFormData] = useState(initialForm);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState(null);
const [previewImage, setPreviewImage] = useState("");
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email.trim());
};
  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setFetching(true);

      // Replace this with the logged-in recruiter's company ID.
      const recruiterCompanyId = localStorage.getItem("companyId");

      if (!recruiterCompanyId) {
        return;
      }

      const { data } = await api.get(`/company/${recruiterCompanyId}`);

      if (data.success && data.company) {
        setCompanyId(data.company._id);

        setFormData({
          ...initialForm,
          ...data.company,
          foundedYear: data.company.foundedYear || "",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to fetch company profile",
      });
    } finally {
      setFetching(false);
    }
  };

  //
const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Image size must be less than 2MB");
    return;
  }

  setImageFile(file);

  const imageUrl = URL.createObjectURL(file);
  setPreviewImage(imageUrl);
};
  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

const email = formData.companyEmail.trim();

if (!email) {
  setMessage({
    type: "error",
    text: "Company email is required",
  });
  return;
}

if (!validateEmail(email)) {
  setMessage({
    type: "error",
    text: "Please enter a valid company email address",
  });
  return;
}
  try {
    setLoading(true);
    setMessage({ type: "", text: "" });

   const payload = new FormData();

Object.entries(formData).forEach(([key, value]) => {

  if (
    key === "profileImage" ||
    key === "jobs" ||
    key === "_id" ||
    key === "createdAt" ||
    key === "updatedAt" ||
    key === "__v"
  ) {
    return;
  }

  if (value !== null && value !== undefined) {
    payload.append(key, value);
  }
});

if (imageFile) {
  payload.append("profileImage", imageFile);
}
console.log("FORM SUBMIT TRIGGERED");
    // Debug FormData
    for (const [key, value] of payload.entries()) {
      console.log(key, value);
    }

    let response;

    if (companyId) {
      response = await api.put(
        `/company/update/${companyId}`,
        payload
      );
    } else {
      response = await api.post("/company/create", payload);
    }

       console.log("SUCCESS RESPONSE:", response.data);
    if (response.data.success) {
      const savedCompany = response.data.company;

      setCompanyId(savedCompany._id);

      localStorage.setItem("companyId", savedCompany._id);

      setFormData({
        ...initialForm,
        ...savedCompany,
        profileImage: savedCompany.profileImage || "",
        foundedYear: savedCompany.foundedYear || "",
      });

      setImageFile(null);
      setPreviewImage("");

      setMessage({
        type: "success",
           text: response.data.message || "Company saved successfully",
      });
    }

  } catch (error) {
    console.error("SUBMIT ERROR:", error);

    console.error("ERROR RESPONSE:", error.response?.data);

    setMessage({
      type: "error",
      text:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });

  } finally {
    setLoading(false);
  }
};
  if (fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Company Profile
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your company information and public profile.
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
            {companyId ? "Edit Profile" : "New Profile"}
          </span>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div
            className={`mb-6 rounded-xl p-4 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}  noValidate className="space-y-6">

          {/* COMPANY BASIC INFORMATION */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

            <SectionTitle
              icon={Building2}
              title="Basic Information"
              subtitle="Add your company's basic details."
            />

          {/* PROFILE IMAGE */}
<div className="mb-6">
  <label className={labelClass}>Company Logo</label>

  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

    {/* Image Preview */}
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-gray-50">
    {previewImage || formData.profileImage ? (
  <img
    src={previewImage || formData.profileImage}
    alt="Company logo"
    className="h-full w-full object-cover"
  />
) : (
  <ImagePlus className="text-gray-400" size={28} />
)}
    </div>

    {/* File Input */}
    <div className="flex-1">
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleImageChange}
        className="w-full cursor-pointer rounded-xl border border-gray-200 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-medium file:text-indigo-600"
      />

      <p className="mt-2 text-xs text-gray-500">
        PNG, JPG, JPEG or WEBP. Maximum size 2MB.
      </p>
    </div>

  </div>
</div>

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Company Name *"
                name="companyName"
                icon={Building2}
                 value={formData.companyName}
                onChange={handleChange}
              />

              <InputField
                label="Company Email *"
                name="companyEmail"
                icon={Mail}
                type="email"
                value={formData.companyEmail}
  onChange={handleChange}
              />

              <InputField
                label="Phone Number"
                name="phone"
                icon={Phone}
                type="tel"
                value={formData.phone}
  onChange={handleChange}
              />

              <InputField
                label="Company Website"
                name="website"
                icon={Globe}
                type="url"
                 value={formData.website}
  onChange={handleChange}
              />

              <div>
                <label className={labelClass}>Industry *</label>

                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select Industry</option>
                  <option value="IT & Software">IT & Software</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Company Size</label>

                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {[
                    "1-10",
                    "11-50",
                    "51-200",
                    "201-500",
                    "501-1000",
                    "1000+",
                  ].map((size) => (
                    <option key={size} value={size}>
                      {size} Employees
                    </option>
                  ))}
                </select>
              </div>

             <InputField
  label="Founded Year"
  name="foundedYear"
  type="number"
  icon={Calendar}
  placeholder="e.g. 2015"
  value={formData.foundedYear}
  onChange={handleChange}
/>

            </div>

            <div className="mt-5">
              <label className={labelClass}>Company Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Tell candidates about your company..."
                className={inputClass}
              />
            </div>

          </div>

          {/* LOCATION */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

            <SectionTitle
              icon={MapPin}
              title="Company Location"
              subtitle="Where is your company located?"
            />

            <div className="grid gap-5 md:grid-cols-2">

              <InputField
                label="Country"
                name="country"
                icon={Globe}
                onChange={handleChange}
                 value={formData.country}
              />

              <InputField
                label="State"
                name="state"
                 onChange={handleChange}
                 value={formData.state}
              />

              <InputField
                label="City"
                name="city"
                 onChange={handleChange}
                 value={formData.city}
              />

              <InputField
                label="Pincode"
                name="pincode"
                 onChange={handleChange}
                 value={formData.pincode}
              />

            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

            <SectionTitle
              icon={Globe}
              title="Social Media Links"
              subtitle="Add your company's social media profiles."
               
            />

            <div className="grid gap-5 md:grid-cols-2">

             <InputField
  label="LinkedIn URL"
  name="linkedin"
  icon={Globe}
  type="url"
  value={formData.linkedin}
  onChange={handleChange}
/>
<InputField
  label="Twitter / X URL"
  name="twitter"
  icon={Globe}
  type="url"
  value={formData.twitter}
  onChange={handleChange}
/>

            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

            <button
              type="button"
              onClick={fetchCompany}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>

            <button
              type="submit"
              disabled={loading}
              onClick={() => console.log("BUTTON CLICKED")}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {loading
                ? "Saving..."
                : companyId
                ? "Update Company Profile"
                : "Create Company Profile"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
