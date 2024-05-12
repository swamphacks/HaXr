'use client';
import { useState } from 'react';

export default function ScanCheckIn() {
  const [userID, setUserID] = useState<String | null>(null);

  const onSubmit = async () => {
    if (!userID) return; // Don't do anything if the user ID is empty

    const response = await fetch(
      `http://localhost:3000/api/user/find?uid=${userID}`,
      {
        method: 'GET',
      }
    );

    const data = await response.json();
    if (data.status === 200) {
      console.log('User found!');
      console.log(
        `User ID: ${data.user.id}\nName: ${data.user.name}\nEmail: ${data.user.email}`
      );
    } else if (data.status === 404) {
      console.log(data.message);
    }
  };

  return (
    <div>
      <h1>Scan in here!</h1>
      <div className='flex flex-row'>
        <input
          type='text'
          onChange={(event) => setUserID(event.target.value)}
        />
        <button onClick={onSubmit}>Check In</button>
      </div>
    </div>
  );
}
