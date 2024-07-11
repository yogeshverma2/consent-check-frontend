import React, { useState } from 'react';

const MobileNumberForm = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingResponse, setPendingResponse] = useState(null);
  const [anotherApiResponse, setAnotherApiResponse] = useState(null); // New state for another API response

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://check-consent-backend.vercel.app/abc?mobile_number=${mobileNumber}`);
      const data = await res.json();
      setResponse(data);
      if (data.Consent && data.Consent.status === 'PENDING') {
        if (data.Consent.registeredDate) {
          setPendingResponse(data);
        } else {
          setPendingResponse(null);
        }
      } else {
        setPendingResponse(null);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handlePendingApiCall = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://check-consent-backend.vercel.app/abcd?mobile_number=${mobileNumber}`);
      const data = await res.json();
      setAnotherApiResponse(data); // Set state with another API response
    } catch (err) {
      setError('Failed to call another API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Mobile Number:
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {pendingResponse && (
        <div>
          <p>Consent status is PENDING. You can call Reinitiate API.</p>
          <button onClick={handlePendingApiCall}>Call Reinitiate API</button>
        </div>
      )}

      {anotherApiResponse && (
        <div>
          <h3>Another API Response:</h3>
          <pre>{JSON.stringify(anotherApiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MobileNumberForm;
