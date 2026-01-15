import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { rfpAPI } from '../services/api';
import type { RFP } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const RFPList: React.FC = () => {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRFPs();
  }, []);

  const fetchRFPs = async () => {
    try {
      const data = await rfpAPI.getAll();
      setRfps(data.rfps);
    } catch (error) {
      toast.error('Failed to fetch RFPs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this RFP?')) return;

    try {
      await rfpAPI.delete(id);
      toast.success('RFP deleted successfully');
      fetchRFPs();
    } catch (error) {
      toast.error('Failed to delete RFP');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'badge-draft',
      sent: 'badge-sent',
      closed: 'badge-closed',
    };
    return badges[status as keyof typeof badges] || 'badge-draft';
  };

  if (loading) {
    return <LoadingSpinner text="Loading RFPs..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">RFPs</h1>
        <button
          onClick={() => navigate('/rfps/create')}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create RFP
        </button>
      </div>

      {rfps.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No RFPs yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first RFP
          </p>
          <button
            onClick={() => navigate('/rfps/create')}
            className="btn-primary"
          >
            Create First RFP
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rfps.map((rfp) => (
            <div
              key={rfp.id}
              onClick={() => navigate(`/rfps/${rfp.id}`)}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {rfp.title}
                </h3>
                <span className={getStatusBadge(rfp.status)}>
                  {rfp.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {rfp.description}
              </p>

              <div className="space-y-2">
                {rfp.budget && (
                  <div className="flex items-center text-sm text-gray-700">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Budget: ${rfp.budget.toLocaleString()}</span>
                  </div>
                )}
                {rfp.delivery_deadline && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      Due: {format(new Date(rfp.delivery_deadline), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Created {format(new Date(rfp.created_at), 'MMM d, yyyy')}
                </span>
                <button
                  onClick={(e) => handleDelete(rfp.id, e)}
                  className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RFPList;
