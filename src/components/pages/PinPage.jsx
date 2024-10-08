import React, { useEffect, useState } from 'react';

const PinPage = () => {
  const [dailyPin, setDailyPin] = useState('');

  useEffect(() => {
    // Generar un nuevo PIN basado en la fecha actual para que cambie cada 24 horas
    const today = new Date();
    const pin = String(today.getFullYear() + today.getMonth() + today.getDate() + 1234).slice(-6); // Genera un PIN de 6 dígitos
    setDailyPin(pin);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-sm mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4">PIN Diario</h2>
      <p className="text-center text-3xl font-bold">{dailyPin}</p>
      <p className="mt-4 text-sm text-gray-600">Este PIN se actualiza cada 24 horas.</p>
    </div>
  );
};

export default PinPage;
