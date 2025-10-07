import {
  FaRobot,
  FaUserMd,
  FaPills,
  FaCalendarCheck,
  FaAmbulance,
  FaFileMedical,
  FaBell,
  FaLanguage,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Add a 'status' to each feature to mark it as 'active' or 'coming soon'
const features = [
  {
    icon: <FaUserMd className="text-green-500 text-3xl" />,
    title: "Multi-vendor Marketplace",
    desc: "Doctors, labs, pharmacies, physiotherapists and all allied services.",
    status: "active",
  },
  {
  icon: <FaPills className="text-green-500 text-3xl" />,
    title: "Medicine Ordering",
    desc: "order medicine from any medsta partnered pharmacy and get it delivered within few hours.",
    status: "active",
  },
  {
  icon: <FaFileMedical className="text-green-500 text-3xl" />,
    title: "Diagnostic Tests",
    desc: "Book diagnostic tests from any medsta partnered lab and get samples collected from home.",
    status: "active",
  },
  {
    icon: <FaCalendarCheck className="text-green-500 text-3xl" />,
    title: "Appointment Booking",
    desc: "Book appointments easily with doctors or physiotherapists.",
    status: "active",
    path: "/book",
  },
  {
  icon: <FaMoneyBillWave className="text-green-500 text-3xl" />,
    title: "COD + Digital Payments",
    desc: "Multiple payment options for convenience.",
    status: "active",
  },
  {
  icon: <FaRobot className="text-gray-400 text-3xl" />,
    title: "AI Symptom Checker",
    desc: "Conversational bot suggests the right doctor, lab, or service nearby.",
    status: "coming soon",
  },
  {
  icon: <FaAmbulance className="text-gray-400 text-3xl" />,
    title: "Patient Transportation",
    desc: "Ambulance, cabs, and bikes for patient transport.",
    status: "coming soon",
  },
  {
  icon: <FaFileMedical className="text-gray-400 text-3xl" />,
    title: "Digital Prescriptions",
    desc: "Access digital prescriptions and health records.",
    status: "coming soon",
  },
  {
  icon: <FaBell className="text-gray-400 text-3xl" />,
    title: "AI Medicine Reminders",
    desc: "Get reminders for your medicines.",
    status: "coming soon",
  },
  {
  icon: <FaLanguage className="text-gray-400 text-3xl" />,
    title: "Multilingual Support",
    desc: "Choose your preferred language.",
    status: "coming soon",
  },
];

export default function Services() {
  return (
  <section id="services" className="py-16 relative">
      {/* Decorative strip at the top */}
      {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div> */}

      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10 text-green-800 tracking-tight">
          Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const commonClasses = `relative bg-green-50 rounded-lg p-6 flex flex-col items-center shadow border border-green-100 hover:shadow-xl transition-shadow duration-300 ${
              f.status === 'coming soon' ? 'opacity-60' : ''
            }`;

            const content = (
              <>
                {/* Badge for "Coming Soon" features */}
                {f.status === 'coming soon' && (
                  <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Coming Soon
                  </div>
                )}

                <div className="mb-4">{f.icon}</div>
                <h3
                  className={`text-xl font-semibold mb-2 text-center ${
                    f.status === 'coming soon' ? 'text-gray-500' : 'text-green-700'
                  }`}
                >
                  {f.title}
                </h3>
                <p className="text-gray-600 text-center">{f.desc}</p>
              </>
            );

            if (f.path) {
              return (
                <Link key={i} to={f.path} className={commonClasses}>
                  {content}
                </Link>
              );
            }

            return (
              <div key={i} className={commonClasses}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
