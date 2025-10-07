import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function GetInTouch() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add your form submission logic here
  };

  return (
    <section className="py-20 bg-slate-50 text-slate-800">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-semibold text-blue-500 mb-3">Get In Touch</h2>
          <p className="text-slate-600 text-lg">
            Have questions or want to partner with us? We'd love to hear from you.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-blue-300 placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-blue-300 placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={6}
                className="w-full px-4 py-4 bg-slate-100 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-blue-300 placeholder-slate-400 resize-none"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-150"
              >
                Send Message
                <FaArrowRight />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}