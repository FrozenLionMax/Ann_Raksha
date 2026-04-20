import React, { useState } from 'react';
import { Upload, MapPin, Clock, Users, AlertCircle, CheckCircle2, Loader, ArrowRight, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateDonationPremium() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    foodCategory: '',
    quantity: '',
    servings: '',
    cookedTime: '',
    expiryTime: '',
    location: '',
    pickupAddress: '',
    urgency: 'normal',
    description: '',
    allergens: [],
    imageUrl: null,
  });

  const [safetyChecks, setSafetyChecks] = useState({
    properStorage: false,
    noContamination: false,
    freshIngredients: false,
    cleanUtensils: false,
    properHandling: false,
  });

  const foodCategories = [
    'Cooked Rice & Grains',
    'Cooked Vegetables',
    'Cooked Meat & Protein',
    'Prepared Meals',
    'Bakery Items',
    'Dairy Products',
    'Beverages',
    'Mixed Food',
    'Other'
  ];

  const allergenOptions = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Fish', 'Shellfish', 'Wheat', 'Soy'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSafetyCheck = (e) => {
    const { name, checked } = e.target;
    setSafetyChecks({ ...safetyChecks, [name]: checked });
  };

  const allSafetyChecksComplete = Object.values(safetyChecks).every(val => val === true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allSafetyChecksComplete) {
      alert('Please complete all food safety checks');
      return;
    }
    setLoading(true);
    try {
      // Call your donation API here
      console.log('Submitting donation:', formData);
      // await createDonation(formData);
      setTimeout(() => {
        setLoading(false);
        setStep(4); // Show success
      }, 1500);
    } catch (error) {
      setLoading(false);
      alert('Error creating donation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F6F2] to-[#FAFAFA] pt-32 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  disabled={s > step}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition ${
                    s < step
                      ? 'bg-[#2F5D50] text-white'
                      : s === step
                      ? 'bg-[#7BAE7F] text-white'
                      : 'bg-[#EDE6DB] text-[#4B5563]'
                  }`}
                >
                  {s < step ? '✓' : s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-1 bg-[#2F5D50] rounded-full"></div>
              <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[#2F5D50]' : 'bg-[#EDE6DB]'}`}></div>
              <div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-[#2F5D50]' : 'bg-[#EDE6DB]'}`}></div>
            </div>
            <div className="flex justify-between mt-4 text-sm font-semibold">
              <span className={step >= 1 ? 'text-[#2F5D50]' : 'text-[#4B5563]'}>Food Details</span>
              <span className={step >= 2 ? 'text-[#2F5D50]' : 'text-[#4B5563]'}>Safety & Location</span>
              <span className={step >= 3 ? 'text-[#2F5D50]' : 'text-[#4B5563]'}>Verification</span>
            </div>
          </div>
        )}

        {/* Step 1: Food Details */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1F2937] mb-2">Donate Food</h1>
              <p className="text-lg text-[#4B5563]">Help us feed communities by sharing your surplus food</p>
            </div>

            <form className="space-y-6">
              {/* Food Category */}
              <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                <label className="block text-sm font-semibold text-[#1F2937] mb-3">What type of food?</label>
                <div className="grid grid-cols-2 gap-3">
                  {foodCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, foodCategory: cat })}
                      className={`p-4 rounded-xl font-medium transition ${
                        formData.foodCategory === cat
                          ? 'bg-[#2F5D50] text-white border-[#2F5D50]'
                          : 'bg-[#FAFAFA] text-[#1F2937] border border-[#EDE6DB] hover:border-[#7BAE7F]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Servings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">Quantity (kg)</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 25"
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE6DB] focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-[#1F2937]"
                  />
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">People Served</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    placeholder="e.g., 50"
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE6DB] focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-[#1F2937]"
                  />
                </div>
              </div>

              {/* Times */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7BAE7F]" /> When was it cooked?
                  </label>
                  <input
                    type="time"
                    name="cookedTime"
                    value={formData.cookedTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE6DB] focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-[#1F2937]"
                  />
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#FF4D4D]" /> Expiry time
                  </label>
                  <input
                    type="time"
                    name="expiryTime"
                    value={formData.expiryTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EDE6DB] focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-[#1F2937]"
                  />
                </div>
              </div>

              {/* Urgency */}
              <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                <label className="block text-sm font-semibold text-[#1F2937] mb-3">Urgency Level</label>
                <div className="flex gap-3">
                  {[
                    { value: 'low', label: 'Low', color: '#7BAE7F' },
                    { value: 'normal', label: 'Normal', color: '#2F5D50' },
                    { value: 'high', label: 'High', color: '#FFB84D' },
                    { value: 'critical', label: 'Critical', color: '#FF4D4D' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: option.value })}
                      className={`px-4 py-2 rounded-lg font-medium transition border-2 ${
                        formData.urgency === option.value
                          ? `border-[${option.color}] bg-[${option.color}] text-white`
                          : 'border-[#EDE6DB] text-[#1F2937] hover:border-[#7BAE7F]'
                      }`}
                      style={formData.urgency === option.value ? { borderColor: option.color, backgroundColor: option.color } : {}}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">Additional Details</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Any special details about the food? Ingredients, preparation method, etc."
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE6DB] focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-[#1F2937]"
                ></textarea>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-white border border-[#EDE6DB] text-[#1F2937] py-3 rounded-xl font-semibold hover:bg-[#FAFAFA] transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-[#2F5D50] text-white py-3 rounded-xl font-semibold hover:bg-[#1F4D40] transition flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Safety & Location */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1F2937] mb-2">Food Safety Verification</h1>
              <p className="text-lg text-[#4B5563]">Ensure your donation meets food safety standards</p>
            </div>

            <form className="space-y-6">
              {/* Safety Checklist */}
              <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
                <h2 className="text-xl font-bold text-[#1F2937] mb-6">Safety Checklist</h2>
                <div className="space-y-4">
                  {[
                    { name: 'properStorage', label: 'Food was stored properly (covered, in clean containers)' },
                    { name: 'noContamination', label: 'No signs of contamination or spoilage' },
                    { name: 'freshIngredients', label: 'Made with fresh ingredients only' },
                    { name: 'cleanUtensils', label: 'Prepared with clean utensils & equipment' },
                    { name: 'properHandling', label: 'Handled following hygiene standards' }
                  ].map((item) => (
                    <label key={item.name} className="flex items-center gap-3 p-4 bg-[#FAFAFA] rounded-xl hover:bg-white transition cursor-pointer">
                      <input
                        type="checkbox"
                        name={item.name}
                        checked={safetyChecks[item.name]}
                        onChange={handleSafetyCheck}
                        className="w-5 h-5 rounded text-[#2F5D50]"
                      />
                      <span className="text-[#1F2937] font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
                <h2 className="text-xl font-bold text-[#1F2937] mb-6">Allergens Present</h2>
                <div className="grid grid-cols-2 gap-3">
                  {allergenOptions.map((allergen) => (
                    <label key={allergen} className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg hover:bg-white transition cursor-pointer">
                      <input
                        type="checkbox"
                        value={allergen}
                        checked={formData.allergens.includes(allergen)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, allergens: [...formData.allergens, allergen] });
                          } else {
                            setFormData({ ...formData, allergens: formData.allergens.filter(a => a !== allergen) });
                          }
                        }}
                        className="w-4 h-4 rounded text-[#2F5D50]"
                      />
                      <span className="text-sm text-[#1F2937]">{allergen}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB]">
                <label className="block text-sm font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7BAE7F]" /> Pickup Location
                </label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleInputChange}
                  placeholder="Enter full pickup address"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE6DB] focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-[#1F2937] mb-3"
                />
              </div>

              {/* Image Upload */}
              <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB] border-dashed">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-[#7BAE7F] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#1F2937] mb-2">Upload Food Photo</p>
                  <p className="text-xs text-[#4B5563] mb-4">For verification purposes</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="inline-block bg-[#7BAE7F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2F5D50] transition cursor-pointer">
                    Choose Image
                  </label>
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <img src={formData.imageUrl} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white border border-[#EDE6DB] text-[#1F2937] py-3 rounded-xl font-semibold hover:bg-[#FAFAFA] transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!allSafetyChecksComplete}
                  className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    allSafetyChecksComplete
                      ? 'bg-[#2F5D50] text-white hover:bg-[#1F4D40]'
                      : 'bg-[#EDE6DB] text-[#4B5563] cursor-not-allowed'
                  }`}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Verification */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1F2937] mb-2">Verify & Submit</h1>
              <p className="text-lg text-[#4B5563]">Review your donation details</p>
            </div>

            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                  <h3 className="font-semibold text-[#1F2937] mb-4">Food Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#4B5563]">Category:</span><span className="font-semibold text-[#1F2937]">{formData.foodCategory}</span></div>
                    <div className="flex justify-between"><span className="text-[#4B5563]">Quantity:</span><span className="font-semibold text-[#1F2937]">{formData.quantity} kg</span></div>
                    <div className="flex justify-between"><span className="text-[#4B5563]">Servings:</span><span className="font-semibold text-[#1F2937]">{formData.servings} people</span></div>
                    <div className="flex justify-between"><span className="text-[#4B5563]">Urgency:</span><span className="font-semibold text-[#1F2937] capitalize">{formData.urgency}</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                  <h3 className="font-semibold text-[#1F2937] mb-4">Timing</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#4B5563]">Cooked:</span><span className="font-semibold text-[#1F2937]">{formData.cookedTime}</span></div>
                    <div className="flex justify-between"><span className="text-[#4B5563]">Expires:</span><span className="font-semibold text-[#1F2937]">{formData.expiryTime}</span></div>
                    <div className="flex justify-between"><span className="text-[#4B5563]">Safe Window:</span><span className="font-semibold text-[#2F5D50]">~2.5 hours</span></div>
                  </div>
                </div>
              </div>

              {/* Safety Status */}
              <div className="bg-gradient-to-br from-[#2F5D50]/5 to-[#7BAE7F]/5 rounded-2xl p-6 border border-[#7BAE7F]/30">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#2F5D50] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#1F2937] mb-2">Safety Verified ✓</h3>
                    <p className="text-sm text-[#4B5563]">All food safety requirements met. Your donation is ready to be shared.</p>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white rounded-2xl p-6 border border-[#EDE6DB]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded text-[#2F5D50] mt-1" defaultChecked />
                  <span className="text-sm text-[#4B5563]">
                    I confirm that this food donation complies with all food safety standards and regulations. I understand that false information may result in penalties.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#2F5D50] text-white py-4 rounded-xl font-semibold hover:bg-[#1F4D40] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Donation
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-8 py-12">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#2F5D50] to-[#7BAE7F] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-[#1F2937] mb-3">Donation Created! 🎉</h1>
              <p className="text-lg text-[#4B5563] max-w-md mx-auto">
                Your donation has been successfully submitted. AI is now finding the best NGO match for you.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[#EDE6DB] max-w-md mx-auto">
              <h2 className="font-bold text-[#1F2937] mb-6">What Happens Next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2F5D50] flex-shrink-0" />
                  <p className="text-sm text-[#4B5563]">AI matches your food with the best NGO</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2F5D50] flex-shrink-0" />
                  <p className="text-sm text-[#4B5563]">NGO claims and schedules pickup</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2F5D50] flex-shrink-0" />
                  <p className="text-sm text-[#4B5563]">Volunteer picks up your food</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2F5D50] flex-shrink-0" />
                  <p className="text-sm text-[#4B5563]">Food is distributed to those in need</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/my-donations')}
                className="flex-1 bg-[#2F5D50] text-white py-3 rounded-xl font-semibold hover:bg-[#1F4D40] transition"
              >
                View My Donations
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-white border border-[#EDE6DB] text-[#1F2937] py-3 rounded-xl font-semibold hover:bg-[#FAFAFA] transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
