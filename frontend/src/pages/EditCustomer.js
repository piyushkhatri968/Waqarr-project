import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const mockCustomer = {
  id: 1,
  name: "Ali Reza",
  phone: "+994 50 123 4567",
  car: "Toyota Corolla 2020",
  purchaseCost: 20000,
  leasingAmount: 15000,
  monthlyAmount: 500,
  leaseMonths: 36,
  leaseStart: "2023-01-01",
};

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    setForm(mockCustomer);
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated customer data:", form);
    navigate("/customers");
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="p-5 w-full">
      <h1 className="text-2xl font-bold mb-6 ">Edit Customer</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="input" />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="input" />

        <input name="car" placeholder="Car (Brand/Model/Year)" value={form.car} onChange={handleChange} className="input" />
        <input
          type="number"
          name="purchaseCost"
          placeholder="Car Purchase Cost (₼)"
          value={form.purchaseCost}
          onChange={handleChange}
          className="input"
        />

        <input
          type="number"
          name="leasingAmount"
          placeholder="Leasing Amount (₼)"
          value={form.leasingAmount}
          onChange={handleChange}
          className="input"
        />
        <input
          type="number"
          name="monthlyAmount"
          placeholder="Monthly Installment (₼)"
          value={form.monthlyAmount}
          onChange={handleChange}
          className="input"
        />

        <input
          type="number"
          name="leaseMonths"
          placeholder="Lease Duration (Months)"
          value={form.leaseMonths}
          onChange={handleChange}
          className="input"
        />
        <input
          type="date"
          name="leaseStart"
          value={form.leaseStart}
          onChange={handleChange}
          className="input"
        />

        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Update Customer
          </button>
        </div>
      </form>
    </div>
  );
}
