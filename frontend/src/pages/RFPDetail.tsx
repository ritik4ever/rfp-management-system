import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Mail,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  RefreshCw,
} from 'lucide-react';
import { rfpAPI, vendorAPI, proposalAPI } from '../services/api';
import type { RFP, Vendor, Proposal, ProposalComparison } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const RFPDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState<RFP | null>(null);
  const [sentVendors, setSentVendors] = useState<any[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [comparison, setComparison] = useState<ProposalComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [checkingEmails, setCheckingEmails] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRFPDetails();
    }
  }, [id]);

  const fetchRFPDetails = async () => {
    try {
      const data = await rfpAPI.getById(id!);
      setRfp(data.rfp);
      setSentVendors(data.vendors);
      setProposals(data.proposals);

      if (data.proposals.length >= 2) {
        fetchComparison();
      }
    } catch (error) {
      toast.error('Failed to fetch RFP details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComparison = async () => {
    try {
      const data = await proposalAPI.compare(id!);
      setComparison(data);
    } catch (error) {
      console.error('Error fetching comparison:', error);
    }
  };

  const openSendModal = async () => {
    try {
      const data = await vendorAPI.getAll();
      setAllVendors(data.vendors);
      setShowSendModal(true);
    } catch (error) {
      toast.error('Failed to fetch vendors');
    }
  };

  const handleSendRFP = async () => {
    if (selectedVendors.length === 0) {
      toast.error('Please select at least one vendor');
      return;
    }

    setSending(true);
    try {
      await vendorAPI.sendRFP(id!, selectedVendors);
      toast.success(`RFP sent to ${selectedVendors.length} vendor(s)`);
      setShowSendModal(false);
      setSelectedVendors([]);
      fetchRFPDetails();
    } catch (error) {
      toast.error('Failed to send RFP');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const checkNewProposals = async () => {
    setCheckingEmails(true);
    try {
      await proposalAPI.checkNew();
      toast.success('Checking for new proposals...');
      setTimeout(() => {
        fetchRFPDetails();
      }, 2000);
    } catch (error) {
      toast.error('Failed to check for new proposals');
      console.error(error);
    } finally {
      setCheckingEmails(false);
    }
  };

  const toggleVendorSelection = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading RFP details..." />;
  }

  if (!rfp) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">RFP not found</p>
      </div>
    );
  }

  const getScoreBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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

      {/* RFP Header */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{rfp.title}</h1>
            <span className={`badge badge-${rfp.status}`}>{rfp.status}</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={checkNewProposals}
              disabled={checkingEmails}
              className="btn-secondary flex items-center"
            >
              <RefreshCw
                className={`h-5 w-5 mr-2 ${checkingEmails ? 'animate-spin' : ''}`}
              />
              Check Emails
            </button>
            <button onClick={openSendModal} className="btn-primary flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Send to Vendors
            </button>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{rfp.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rfp.budget && (
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-semibold">${rfp.budget.toLocaleString()}</p>
              </div>
            </div>
          )}
          {rfp.delivery_deadline && (
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Deadline</p>
                <p className="font-semibold">
                  {format(new Date(rfp.delivery_deadline), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          )}
          {rfp.payment_terms && (
            <div>
              <p className="text-sm text-gray-600">Payment Terms</p>
              <p className="font-semibold">{rfp.payment_terms}</p>
            </div>
          )}
          {rfp.warranty_period && (
            <div>
              <p className="text-sm text-gray-600">Warranty</p>
              <p className="font-semibold">{rfp.warranty_period}</p>
            </div>
          )}
        </div>

        {rfp.requirements?.items && rfp.requirements.items.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
            <div className="space-y-3">
              {rfp.requirements.items.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                  </div>
                  <p className="text-sm text-gray-700">{item.specifications}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sent Vendors */}
      {sentVendors.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sent to Vendors ({sentVendors.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sentVendors.map((vendor) => (
              <div key={vendor.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.email}</p>
                {vendor.sent_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Sent: {format(new Date(vendor.sent_at), 'MMM d, yyyy h:mm a')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Comparison */}
      {comparison && comparison.comparison && (
        <div className="card mb-6 bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">AI Recommendation</h2>
          </div>

          <div className="bg-white rounded-lg p-6 mb-4">
            <p className="text-gray-700 mb-4">{comparison.comparison.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparison.comparison.best_overall && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-900">Best Overall</span>
                  </div>
                  <p className="text-sm text-green-800">
                    {comparison.proposals.find(
                      (p) => p.vendor_id === comparison.comparison.best_overall
                    )?.vendor_name || 'N/A'}
                  </p>
                </div>
              )}
              {comparison.comparison.best_price && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-900">Best Price</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    {comparison.proposals.find(
                      (p) => p.vendor_id === comparison.comparison.best_price
                    )?.vendor_name || 'N/A'}
                  </p>
                </div>
              )}
              {comparison.comparison.best_delivery && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-900">Best Delivery</span>
                  </div>
                  <p className="text-sm text-purple-800">
                    {comparison.proposals.find(
                      (p) => p.vendor_id === comparison.comparison.best_delivery
                    )?.vendor_name || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Comparison */}
          {comparison.comparison.details && (
            <div className="space-y-4">
              {comparison.comparison.details.map((detail) => (
                <div key={detail.vendor_id} className="bg-white rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {detail.vendor_name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(detail.score)}`}
                    >
                      Score: {detail.score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Pros</h4>
                      <ul className="space-y-1">
                        {detail.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Cons</h4>
                      <ul className="space-y-1">
                        {detail.cons.map((con, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="text-red-600 mr-2">✗</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Proposals */}
      {proposals.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Proposals Received ({proposals.length})
          </h2>
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {proposal.vendor_name}
                    </h3>
                    <p className="text-sm text-gray-600">{proposal.vendor_email}</p>
                  </div>
                  {proposal.ai_score && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(proposal.ai_score)}`}
                    >
                      Score: {proposal.ai_score}/100
                    </span>
                  )}
                </div>

                {proposal.ai_summary && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">{proposal.ai_summary}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {proposal.total_price && (
                    <div>
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="font-semibold text-gray-900">
                        ${proposal.total_price.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {proposal.delivery_time && (
                    <div>
                      <p className="text-sm text-gray-600">Delivery</p>
                      <p className="font-semibold text-gray-900">{proposal.delivery_time}</p>
                    </div>
                  )}
                  {proposal.payment_terms && (
                    <div>
                      <p className="text-sm text-gray-600">Payment Terms</p>
                      <p className="font-semibold text-gray-900">{proposal.payment_terms}</p>
                    </div>
                  )}
                  {proposal.warranty && (
                    <div>
                      <p className="text-sm text-gray-600">Warranty</p>
                      <p className="font-semibold text-gray-900">{proposal.warranty}</p>
                    </div>
                  )}
                </div>

                {proposal.parsed_data?.items && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                              Item
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                              Qty
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                              Unit Price
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {proposal.parsed_data.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{item.quantity}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">
                                ${item.unit_price?.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                ${item.total_price?.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  Received: {format(new Date(proposal.received_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {proposals.length === 0 && sentVendors.length > 0 && (
        <div className="card text-center py-12">
          <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Proposals Received Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Check your email or click the button above to fetch new proposals
          </p>
        </div>
      )}

      {/* Send RFP Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="Send RFP to Vendors"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Select vendors to send this RFP to via email:
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allVendors.map((vendor) => {
              const alreadySent = sentVendors.some((v) => v.id === vendor.id);
              return (
                <label
                  key={vendor.id}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedVendors.includes(vendor.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${alreadySent ? 'opacity-50' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={() => toggleVendorSelection(vendor.id)}
                    disabled={alreadySent}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">{vendor.name}</p>
                    <p className="text-sm text-gray-600">{vendor.email}</p>
                    {alreadySent && (
                      <span className="text-xs text-gray-500">Already sent</span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          {allVendors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No vendors found</p>
              <button
                onClick={() => {
                  setShowSendModal(false);
                  navigate('/vendors');
                }}
                className="btn-primary"
              >
                Add Vendors
              </button>
            </div>
          )}

          {allVendors.length > 0 && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowSendModal(false)}
                className="btn-secondary"
                disabled={sending}
              >
                Cancel
              </button>
              <button
                onClick={handleSendRFP}
                className="btn-primary flex items-center"
                disabled={sending || selectedVendors.length === 0}
              >
                {sending ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send to {selectedVendors.length} Vendor(s)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RFPDetail;
