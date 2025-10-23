import React from 'react';

export default function Policies() {
  return (
    <div className="py-20 px-4 bg-white text-slate-800">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">
            🏥 Medsta Legal Policies
          </h1>
          <p className="text-slate-500">
            <strong>Company:</strong> Medsta Private Limited | <strong>Effective Date:</strong> October 2025
          </p>
        </header>

        {/* Quick Links for easy navigation */}
        <nav className="mb-16 p-6 bg-slate-50 rounded-lg border">
          <h2 className="text-xl font-bold mb-3 text-slate-800">Quick Links</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><a href="#terms" className="text-blue-600 hover:underline">Terms & Conditions</a></li>
            <li><a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a></li>
            <li><a href="#payment" className="text-blue-600 hover:underline">Fee & Payment Policy</a></li>
            <li><a href="#delivery" className="text-blue-600 hover:underline">Delivery Policy</a></li>
            <li><a href="#returns" className="text-blue-600 hover:underline">Return, Refund & Cancellation Policy</a></li>
            <li><a href="#contact" className="text-blue-600 hover:underline">Contact Us</a></li>
          </ul>
        </nav>

        {/* Main policy content */}
        <div className="space-y-16">
          {/* --- 1. Terms & Conditions --- */}
          <section id="terms" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">1️⃣ Terms & Conditions</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <h3 className="text-xl font-semibold text-slate-800">Introduction</h3>
              <p>Welcome to Medsta, a hyper-local digital healthcare marketplace that connects users with doctors, pharmacies, diagnostic centers, physiotherapists, ambulance services, and wellness providers. By accessing or using the Medsta website, mobile app, WhatsApp service, or call-based booking, you agree to comply with and be bound by these Terms & Conditions.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Definitions</h3>
              <p><strong>“User”</strong> means any individual accessing or using Medsta’s platform.</p>
              <p><strong>“Provider”</strong> means any healthcare professional, pharmacy, diagnostic center, or service partner listed on Medsta.</p>
              <p><strong>“Affiliate”</strong> refers to CSC centers or agents assisting users.</p>
              <p><strong>“Service”</strong> means booking, ordering, or delivery functions available on Medsta.</p>
              <p><strong>“We,” “Our,” or “Us”</strong> refers to Medsta Private Limited.</p>

              <h3 className="text-xl font-semibold text-slate-800">Eligibility</h3>
              <p>You must be at least 18 years old to use the platform. By using Medsta, you confirm that all information you provide (including prescriptions, reports, or health details) is true and accurate.</p>

              <h3 className="text-xl font-semibold text-slate-800">Role of Medsta</h3>
              <p>Medsta acts as a technology facilitator and intermediary. We do not provide medical advice or treatment directly. Actual services (consultation, medicine supply, diagnostics, etc.) are rendered by third-party verified providers.</p>

              <h3 className="text-xl font-semibold text-slate-800">User Responsibilities</h3>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Provide accurate details (medical, personal, contact, and delivery).</li>
                <li>Upload valid prescriptions for medicines requiring them.</li>
                <li>Use the platform responsibly and in compliance with applicable laws.</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800">Provider Responsibilities</h3>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Maintain proper licenses, qualifications, and legal compliance.</li>
                <li>Offer accurate service descriptions and timely delivery.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-slate-800">Limitation of Liability</h3>
              <p>Medsta shall not be liable for: Any incorrect diagnosis, medical negligence, or advice by providers. Any delay in service delivery caused by providers, logistics, or external conditions. Any indirect or consequential damages resulting from service use.</p>

              <h3 className="text-xl font-semibold text-slate-800">Account Termination</h3>
              <p>Medsta reserves the right to suspend or terminate user accounts found violating policies or laws.</p>

              <h3 className="text-xl font-semibold text-slate-800">Governing Law</h3>
              <p>These Terms shall be governed by and construed under the laws of India, with jurisdiction in Barabanki, Uttar Pradesh.</p>
            </div>
          </section>

          {/* --- 2. Privacy Policy --- */}
          <section id="privacy" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">2️⃣ Privacy Policy</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <h3 className="text-xl font-semibold text-slate-800">Data We Collect</h3>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Personal:</strong> Name, contact number, address, age, gender.</li>
                <li><strong>Health:</strong> Prescriptions, reports, and medical history (optional).</li>
                <li><strong>Technical:</strong> Device info, IP address, and usage analytics.</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800">Purpose of Data Collection</h3>
              <p>We use this data to: Process bookings, orders, and deliveries. Communicate via calls, WhatsApp, SMS, or email. Facilitate secure payments and service tracking. Improve platform functionality and safety.</p>

              <h3 className="text-xl font-semibold text-slate-800">Data Sharing</h3>
              <p>Your data may be shared with: Razorpay (for secure payments), WhatsApp API (for order updates and support), Google Maps (for delivery tracking), and verified delivery partners and providers (to complete your order). We never sell or rent your personal data.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Data Storage & Protection</h3>
              <p>Data is stored on secure servers with encryption and limited access. You may request correction or deletion of your data by emailing <a href="mailto:medsta.in8@gmail.com" className="text-blue-600 hover:underline">medsta.in8@gmail.com</a>.</p>

              <h3 className="text-xl font-semibold text-slate-800">Legal Compliance</h3>
              <p>Medsta complies with the Information Technology Act, 2000, and relevant Data Protection and Consumer Protection Rules of India.</p>
            </div>
          </section>

          {/* --- 3. Fee & Payment Policy --- */}
          <section id="payment" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">3️⃣ Fee & Payment Policy</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <h3 className="text-xl font-semibold text-slate-800">Payment Methods</h3>
              <p>We accept: Razorpay (UPI, Credit/Debit Cards, Net Banking, Wallets) and Cash on Delivery (where available).</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Charges</h3>
              <p>Service fees, delivery charges, and convenience fees (if applicable) are displayed before checkout. No hidden charges are applied.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Refunds & Payment Terms</h3>
              <p>Payments for consultations, lab tests, and diagnostics are non-refundable once completed. Refunds are allowed only for defective or wrong products after verification and are credited to the original payment method within 7–10 working days.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Pricing & Revisions</h3>
              <p>Medsta reserves the right to revise fees, commissions, or charges without prior notice.</p>
            </div>
          </section>

          {/* --- 4. Delivery Policy --- */}
          <section id="delivery" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">4️⃣ Delivery Policy</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <h3 className="text-xl font-semibold text-slate-800">Delivery Methods</h3>
              <p><strong>Home Delivery:</strong> Medicines and health products delivered through verified partners.</p>
              <p><strong>Self-Pickup:</strong> Users can collect their order directly from the pharmacy or provider.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Delivery Channels</h3>
              <p>Orders can be placed via Website, Mobile App, WhatsApp, or Phone Call. This ensures accessibility for users with limited digital literacy.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Timelines</h3>
              <p>Delivery times depend on provider availability and location. We aim to deliver within standard local timelines but delays may occur due to weather, traffic, or unforeseen events.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Tracking</h3>
              <p>Users can track their order in real time through Google Maps or receive updates on WhatsApp.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Disclaimer</h3>
              <p>Medsta is not liable for delivery delays or failure due to provider errors or force majeure conditions.</p>
            </div>
          </section>
          
          {/* --- 5. Return, Refund & Cancellation Policy --- */}
          <section id="returns" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">5️⃣ Return, Refund & Cancellation Policy</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <h3 className="text-xl font-semibold text-slate-800">Cancellations</h3>
              <p>Allowed only before the order is dispatched. Once dispatched, cancellation requests will not be accepted.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Returns</h3>
              <p>Returns are accepted only if: A defective, damaged, or wrong product is delivered, and proof (photo/video) is submitted within 48 hours of delivery.</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Refunds</h3>
              <p>Refunds are processed after product verification by the provider and are credited to the original payment method within 7–10 business days. No refunds for successfully availed services (consultations, diagnostics, etc.).</p>
              
              <h3 className="text-xl font-semibold text-slate-800">Exceptions</h3>
              <p>Medsta reserves the right to reject returns/refunds in cases of misuse, tampering, or policy abuse.</p>
            </div>
          </section>

          {/* --- 6. Contact Us --- */}
          <section id="contact" className="scroll-mt-20">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">6️⃣ Contact Us</h2>
            <div className="space-y-2 text-slate-600 leading-relaxed">
              <p>If you have any questions or concerns, please contact:</p>
              <p><strong>Medsta Private Limited</strong></p>
              <p>Barabanki, Uttar Pradesh, India</p>
              <p>
                📧 <strong>Email:</strong> <a href="mailto:medsta.in8@gmail.com" className="text-blue-600 hover:underline">medsta.in8@gmail.com</a>
              </p>
              <p>
                🌐 <strong>Website:</strong> <a href="http://www.medsta.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.medsta.in</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}