import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, ArrowLeft } from 'lucide-react';
import { rfpAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateRFP: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [structuredData, setStructuredData] = useState<any>(null);
  const navigate = useNavigate();

  const exampleInputs = [
    'I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty.',
    'Looking to purchase office furniture for 50 employees. Need ergonomic chairs, standing desks, and filing cabinets. Budget is $75,000. Delivery needed within 45 days. Payment terms: Net 60. Warranty: 2 years minimum.',
    'Need to procure software licenses for project management tool. 100 users, enterprise tier. Budget $30,000 annually. Implementation support required. Payment: Quarterly. Contract: 12 months minimum.',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error('Please enter your procurement requirements');
      return;
    }

    setLoading(true);
    setStructuredData(null);

    try {
      const response = await rfpAPI.create({ naturalLanguageInput: input });
      setStructuredData(response.structured_data);
      toast.success('RFP created successfully!');

      setTimeout(() => {
        navigate(`/rfps/${response.rfp.id}`);
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create RFP');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const useExample = (example: string) => {
    setInput(example);
  };

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to RFPs
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create RFP with AI
          </h1>
          <p className="text-gray-600">
            Describe what you need in natural language, and our AI will structure it into a professional RFP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your procurement requirements
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g., I need to procure laptops and monitors for our new office. Budget is $50,000 total..."
            className="input min-h-[200px] resize-none"
            disabled={loading}
          />

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating RFP...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Create RFP
                </>
              )}
            </button>
          </div>
        </form>

        {/* Example Inputs */}
        {!loading && !structuredData && (
          <div className="card bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4">
              Try these examples:
            </h3>
            <div className="space-y-3">
              {exampleInputs.map((example, index) => (
                <div
                  key={index}
                  onClick={() => useExample(example)}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm cursor-pointer transition-all"
                >
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Structured Data Preview */}
        {structuredData && (
          <div className="card animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="h-5 w-5 text-primary-600 mr-2" />
              AI-Generated RFP Structure
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <p className="text-gray-900">{structuredData.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-700">{structuredData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {structuredData.budget && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget
                    </label>
                    <p className="text-gray-900">
                      ${structuredData.budget.toLocaleString()}
                    </p>
                  </div>
                )}
                {structuredData.delivery_deadline && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Deadline
                    </label>
                    <p className="text-gray-900">
                      {new Date(structuredData.delivery_deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {structuredData.payment_terms && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Terms
                    </label>
                    <p className="text-gray-900">{structuredData.payment_terms}</p>
                  </div>
                )}
                {structuredData.warranty_period && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty
                    </label>
                    <p className="text-gray-900">{structuredData.warranty_period}</p>
                  </div>
                )}
              </div>

              {structuredData.requirements?.items && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <div className="space-y-3">
                    {structuredData.requirements.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {item.specifications}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✓ Redirecting to RFP details page...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRFP;
