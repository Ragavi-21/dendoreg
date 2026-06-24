import LegalLayout from './LegalLayout.jsx'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '../../data/contact.js'

function TermsAndConditions() {
  return (
    <LegalLayout
      title="Terms and Conditions"
      intro={
        'These Terms and Conditions ("Terms") govern the use of the DENDO platform operated under DENDO Private ' +
        'Limited. By accessing or using the DENDO application, website, or services, you agree to these Terms and ' +
        'Conditions.'
      }
    >
      <section>
        <h2>1. Eligibility</h2>
        <p>DENDO is strictly intended only for individuals who are 18 years of age or older.</p>
        <p>By using the Platform, you confirm that:</p>
        <ul>
          <li>You are legally eligible to enter into binding agreements.</li>
          <li>The information provided by you is accurate.</li>
          <li>You will use the Platform only for lawful purposes.</li>
        </ul>
      </section>

      <section>
        <h2>2. Platform Services</h2>
        <p>
          DENDO operates as a technology-enabled delivery and service facilitation platform connecting users with
          vendors and delivery partners.
        </p>
        <p>Services may include:</p>
        <ul>
          <li>Food delivery</li>
          <li>Grocery delivery</li>
          <li>Pharmacy delivery</li>
          <li>Hyperlocal quick delivery services</li>
        </ul>
      </section>

      <section>
        <h2>3. Account Responsibility</h2>
        <p>Users are responsible for:</p>
        <ul>
          <li>Maintaining account confidentiality</li>
          <li>Securing login credentials</li>
          <li>Activities conducted through their account</li>
        </ul>
        <p>DENDO may suspend or terminate accounts involved in fraud, misuse, abuse, or illegal activities.</p>
      </section>

      <section>
        <h2>4. Orders and Payments</h2>
        <p>Orders are subject to:</p>
        <ul>
          <li>Vendor acceptance</li>
          <li>Product availability</li>
          <li>Delivery serviceability</li>
          <li>Successful payment authorization</li>
        </ul>
        <p>Users agree to pay:</p>
        <ul>
          <li>Product charges</li>
          <li>Delivery fees</li>
          <li>Taxes</li>
          <li>Packaging charges</li>
          <li>Platform fees where applicable</li>
        </ul>
      </section>

      <section>
        <h2>5. Cancellations and Refunds</h2>
        <p>Cancellation and refund eligibility may vary depending on:</p>
        <ul>
          <li>Order status</li>
          <li>Vendor policies</li>
          <li>Delivery status</li>
          <li>Product category</li>
        </ul>
        <p>
          DENDO reserves the right to deny refunds in cases involving misuse, fraud, repeated abuse, or false
          complaints.
        </p>
      </section>

      <section>
        <h2>6. Delivery Terms</h2>
        <p>Delivery timelines are estimates and may vary due to:</p>
        <ul>
          <li>Traffic conditions</li>
          <li>Weather conditions</li>
          <li>Vendor delays</li>
          <li>Operational issues</li>
        </ul>
        <p>Users must provide accurate delivery information and cooperate during delivery.</p>
      </section>

      <section>
        <h2>7. User Conduct</h2>
        <p>Users shall not:</p>
        <ul>
          <li>Use the Platform for unlawful activities</li>
          <li>Abuse vendors, delivery partners, or employees</li>
          <li>Conduct fraudulent transactions</li>
          <li>Misuse offers or promotions</li>
          <li>Attempt unauthorized access to the Platform</li>
        </ul>
        <p>Violation may result in account suspension or permanent termination.</p>
      </section>

      <section>
        <h2>8. Privacy</h2>
        <p>Use of the Platform is also governed by the DENDO Privacy Policy.</p>
        <p>
          By using the Platform, users consent to the collection and processing of information as described in the
          Privacy Policy.
        </p>
      </section>

      <section>
        <h2>9. Communication Consent</h2>
        <p>Users agree to receive:</p>
        <ul>
          <li>Order updates</li>
          <li>OTPs</li>
          <li>Delivery notifications</li>
          <li>Customer support messages</li>
          <li>Promotional communications where legally permitted</li>
        </ul>
        <p>Communications may be sent through:</p>
        <ul>
          <li>WhatsApp</li>
          <li>SMS</li>
          <li>Email</li>
          <li>Phone calls</li>
          <li>Push notifications</li>
        </ul>
      </section>

      <section>
        <h2>10. Limitation of Liability</h2>
        <p>DENDO shall not be liable for:</p>
        <ul>
          <li>Delivery delays</li>
          <li>Vendor-related quality issues</li>
          <li>Technical downtime</li>
          <li>Data loss</li>
          <li>Indirect or consequential damages</li>
        </ul>
        <p>Services are provided on an "as is" and "as available" basis.</p>
      </section>

      <section>
        <h2>11. Termination</h2>
        <p>DENDO reserves the right to suspend or terminate user access for:</p>
        <ul>
          <li>Violation of Terms</li>
          <li>Fraudulent activities</li>
          <li>Misuse of the Platform</li>
          <li>Harmful conduct</li>
        </ul>
      </section>

      <section>
        <h2>12. Modifications to Terms</h2>
        <p>DENDO may update these Terms at any time.</p>
        <p>Updates may be communicated through:</p>
        <ul>
          <li>In-app notifications</li>
          <li>WhatsApp communications</li>
          <li>SMS</li>
          <li>Email</li>
          <li>Website announcements</li>
        </ul>
        <p>Continued use of the Platform constitutes acceptance of revised Terms.</p>
      </section>

      <section>
        <h2>13. Governing Law</h2>
        <p>These Terms shall be governed by the laws of India.</p>
        <p>Any disputes shall be subject to the jurisdiction of courts located in Dharmapuri, Tamil Nadu, India.</p>
      </section>

      <section>
        <h2>14. Contact Information</h2>
        <div className="legal-contact-card">
          <span>
            Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </span>
          <span>
            Phone Number: <a href={`tel:${CONTACT_PHONE_HREF}`}>{CONTACT_PHONE}</a>
          </span>
        </div>
      </section>

      <p className="legal-closing">
        By using the DENDO Platform, users acknowledge that they have read, understood, and agreed to these Terms
        and Conditions. DENDO operates as a service and application under DENDO Private Limited.
      </p>
    </LegalLayout>
  )
}

export default TermsAndConditions
