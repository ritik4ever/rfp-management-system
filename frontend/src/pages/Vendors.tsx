import React, { useState, useEffect } from 'react';
import { Plus, Users, Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import { vendorAPI } from '../services/api';
import type { Vendor } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contact_person: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await vendorAPI.getAll();
      setVendors(data.vendors);
    } catch (error) {
      toast.error('Failed to fetch vendors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      contact_person: '',
      address: '',
    });
    setEditingVendor(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone || '',
      contact_person: vendor.contact_person || '',
      address: vendor.address || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setSubmitting(true);

    try {
      if (editingVendor) {
        await vendorAPI.update(editingVendor.id, formData);
        toast.success('Vendor updated successfully');
      } else {
        await vendorAPI.create(formData);
        toast.success('Vendor created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchVendors();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save vendor');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await vendorAPI.delete(id);
      toast.success('Vendor deleted successfully');
      fetchVendors();
    } catch (error) {
      toast.error('Failed to delete vendor');
      console.error(error);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading vendors..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
        <button onClick={openCreateModal} className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Vendor
        </button>
      </div>

      {vendors.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors yet</h3>
          <p className="text-gray-600 mb-6">
            Add vendors to send RFPs to
          </p>
          <button onClick={openCreateModal} className="btn-primary">
            Add First Vendor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(vendor)}
                    className="text-primary-600 hover:text-primary-700 p-1 rounded hover:bg-primary-50 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vendor.id)}
                    className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <a
                    href={`mailto:${vendor.email}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {vendor.email}
                  </a>
                </div>

                {vendor.phone && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <a
                      href={`tel:${vendor.phone}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {vendor.phone}
                    </a>
                  </div>
                )}

                {vendor.contact_person && (
                  <div className="text-sm text-gray-700">
                    <span className="text-gray-500">Contact:</span> {vendor.contact_person}
                  </div>
                )}

                {vendor.address && (
                  <div className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
                    {vendor.address}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Vendor Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contact_person}
              onChange={(e) =>
                setFormData({ ...formData, contact_person: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input min-h-[80px] resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                  Saving...
                </>
              ) : (
                <>{editingVendor ? 'Update' : 'Create'} Vendor</>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vendors;
