import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 w-380 text-white mt-16">

      <div className=" mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <h2 className="text-2xl font-bold">
              Hire<span className="text-indigo-400">AI</span>
            </h2>

            <p className="text-slate-400 mt-4 text-sm leading-7">
              Find your dream job with the power of AI.
              Discover opportunities and build your career.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>

            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <Link to="/">Home</Link>
              <Link to="/jobs">Find Jobs</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 ">AI Features</h3>

            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <h2>AI Resume Analyzer</h2>
            
              <h2>Job Recommendations</h2>
              <h2>Resume–Job Matching</h2>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-sm text-slate-400">
          © 2026 HireAI. All rights reserved.
        </div>

      </div>

    </footer>
  );
}

export default Footer;