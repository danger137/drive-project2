
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import "./sub.css";
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/navigation';
export default function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [CompanyName, setCompanylName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(''); // State for product selection
  const stripe = useStripe();
  const elements = useElements();
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading


  // Define product price IDs
  const productPriceIds = {
    product1: 'price_1R4kW5PwU9mXy2QmQuepM7c5',
    product2: 'price_1R4kTcPwU9mXy2QmXESU0uD1',
    product3: 'price_1R4kZHPwU9mXy2QmAcChl1gM',
    product4: 'price_1R4kbMPwU9mXy2QmjWsDdkm1',
    product5: 'price_1R4kdKPwU9mXy2QmiXS8dKmV',
    product6: 'price_1R4kfvPwU9mXy2QmgXYUg9zD',
    product7: 'price_1R4kltPwU9mXy2QmbRN8LXmb',
    product8: 'price_1R4kncPwU9mXy2QmLjVHGUha',
    product9: 'price_1R4kqwPwU9mXy2Qmtl0FILhj',
    product10: 'price_1R4ksZPwU9mXy2QmBOi6yTec',
    product11: 'price_1R4l0nPwU9mXy2QmmfJF7YLt',
    product12: 'price_1R4l2SPwU9mXy2QmgpB97MFe',
    product13: 'price_1R4l7TPwU9mXy2Qm1tm2Bzxw',
    product14: 'price_1R4l9HPwU9mXy2QmQccLOJpX',
    product15: 'price_1R4lDjPwU9mXy2QmZDz2D6Ac',
    product16: 'price_1R4lI8PwU9mXy2Qm7piO8xQq',
    product17: 'price_1R4lOfPwU9mXy2QmGeWr2RvO',
    product18: 'price_1R4kx3PwU9mXy2QmYYURdSmP',
  };


let move = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      console.error("Stripe.js hasn't loaded yet.");
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error('CardElement not found');
      return;
    }
  
    setLoading(true);
  
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: { email },
    });
  
    if (error) {
      console.error('Error creating payment method:', error);
      setAlertMessage('Error creating payment method. Please try again.');
      setShowAlert(true);
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
    
      const { data } = await axios.post('/api/checkout', {
        email,
        paymentMethodId: paymentMethod.id,
        priceId: productPriceIds[selectedProduct],
      });
    
      console.log('Subscription created successfully:', data);
    
      // صارف کو ڈیٹا بیس میں محفوظ کریں
      await axios.post('/api/saveUser', {
        email,
        name: fullName,
        password, // حیش شدہ پاس ورڈ بھیجنا
      });
    
      setAlertMessage('Congratulations! Your subscription was successful.');
      setShowAlert(true);
    
      // اگر منتخب کردہ پروڈکٹ `product1` یا `product2` ہے تو مخصوص URL پر بھیجیں
      if (selectedProduct === 'product1') {
        window.location.href = 'https://www.va-drivercourses.com/clickIn.php?school=326';
      } else if (selectedProduct === 'product2') {
        window.location.href = 'https://www.va-drivercourses.com/clickIn.php?school=448';
      }else if (selectedProduct === 'product3') {
        window.location.href = 'https://www.va-drivercourses.com/clickIn.php?school=449';
      }else if (selectedProduct === 'product4') {
        window.location.href = ' https://www.va-drivercourses.com/clickIn.php?school=450';
      }else {
        move.push('/Login');
      }
    } catch (err) {
      console.error('Error creating subscription:', err.response?.data?.error || err.message);
      setAlertMessage('Subscription failed. Please try again.');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
    
  
    setEmail('');
    setFullName('');
    setCompanylName('');
    setSelectedProduct('');
    setPassword('');

    elements.getElement(CardElement).clear();
  };
  
  

  return (

<div id='cbg' className="subscription-container">
  <h2 className="subscription-heading">Subscribe to Our Service</h2>
  <form onSubmit={handleSubmit} className="subscription-form">
    <div className="form-group">
      <label htmlFor="fullName" className="form-label">Full Name</label>
      <input
        type="text"
        id="fullName"
        placeholder="Enter your full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="form-input"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="CompanyName" className="form-label">Company Name</label>
      <input
        type="text"
        id="fullName"
        placeholder="Enter your company name"
        value={CompanyName}
        onChange={(e) => setCompanylName(e.target.value)}
        className="form-input"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="email" className="form-label">Email address</label>
      <input
        type="email"
        id="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
        required
      />
      <input
        type="password"
        id="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="subscriptionPlan" className="form-label">Subscription Plan</label>
      <select
        id="subscriptionPlan"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        className="form-select"
        required
      >
        <option value="">Choose a plan...</option>
        <option value="product1">Driver Improvement Clinic-60$</option>
        <option value="product2">DUI /DWI Alcohol Training 12-hours-250$</option>
        <option value="product3">Driver Education Teen or Adult-90$</option>
        <option value="product4">Three Time Failed DMV-95$</option>
        <option value="product5">90-Minute Parent Meeting Teen Student USA High School-45$</option>
        <option value="product6">Defensive driving Course-55$</option>
        <option value="product7">Car Calibration Report-120$</option>
        <option value="product8">Community Service Hours-100$</option>
        <option value="product9">License Teen -DMV BTW-350$</option>
        <option value="product10">Adult License-550$</option>
       
        <option value="product11">Anger Management Class 12-Hour-100$ </option>
        <option value="product12">Road Test Driving Session in DMV-165$</option>
        <option value="product13">Teen 10 Hours Driving Lessons-500$</option>
        <option value="product14">Refresh Driving for two hours-110$</option>
        <option value="product15">Adult 7 Hours Re-Examination DMV Failed-355$</option>
        <option value="product16">Adult Road Test Waiver DMV-350$</option>
        <option value="product17">Welcome Pack -International Drivers-220$</option>
        <option value="product18">Notary Public-10$</option>
      </select>
    </div>
    <div className="form-group">
    <CardElement options={{ style: { base: { fontSize: '16px', color: '#333' } } }} className="cardElement" />
    </div>

    <button type="submit" className="form-button" disabled={!stripe || !elements}>
      Subscribe Now
    </button>
  </form>
  {loading && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '5px', color: '#fff' }}>
          <p>Loading...</p>
          <div className="spinner" style={{ border: '8px solid #f3f3f3', borderTop: '8px solid #3498db', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite' }}></div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {showAlert && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#d4edda', padding: '10px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
          <p>{alertMessage}</p>
          <button
            onClick={() => setShowAlert(false)}
            style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}
</div>



  

  


  
  );
}
