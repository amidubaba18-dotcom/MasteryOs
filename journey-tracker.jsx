import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Flag, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

/**
 * JOURNEY TRACKER APPLICATION
 * 
 * TECHNOLOGY STACK:
 * - Frontend: React 18 with Hooks (useState, useEffect)
 * - Styling: Tailwind CSS utility classes
 * - Icons: Lucide React icon library
 * - Storage: Browser localStorage API for data persistence
 * 
 * ARCHITECTURE OVERVIEW:
 * This is a single-page application (SPA) that manages journey/trip tracking.
 * Data persists in browser storage, making it work offline without a backend.
 */

const JourneyTracker = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Main journeys array - stores all journey records
   * Each journey object contains: id, title, startDate, endDate, destinations, status, notes
   */
  const [journeys, setJourneys] = useState([]);
  
  /**
   * Form state for creating/editing journeys
   * Tracks current input values in the form
   */
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    EndofTask: '',
    status: 'planning',
    notes: ''
  });
  
  /**
   * UI state management
   * - showForm: controls visibility of add/edit form
   * - editingId: stores ID of journey being edited (null when adding new)
   * - filter: current filter selection for displaying journeys
   */
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');

  // ============================================================================
  // DATA PERSISTENCE - localStorage Integration
  // ============================================================================
  
  /**
   * useEffect Hook: Runs once on component mount
   * Purpose: Load saved journeys from browser's localStorage
   * 
   * How it works:
   * 1. Retrieves 'journeys' key from localStorage
   * 2. Parses JSON string back into JavaScript object
   * 3. Updates state with loaded data
   * 4. Empty dependency array [] means this runs only once on mount
   */
  useEffect(() => {
    const savedJourneys = localStorage.getItem('journeys');
    if (savedJourneys) {
      setJourneys(JSON.parse(savedJourneys));
    }
  }, []);

  /**
   * useEffect Hook: Runs whenever journeys array changes
   * Purpose: Save journeys to localStorage for persistence
   * 
   * How it works:
   * 1. Converts journeys array to JSON string
   * 2. Saves to localStorage under 'journeys' key
   * 3. Dependency [journeys] means this runs every time journeys updates
   */
  useEffect(() => {
    localStorage.setItem('journeys', JSON.stringify(journeys));
  }, [journeys]);

  // ============================================================================
  // FORM HANDLING FUNCTIONS
  // ============================================================================
  
  /**
   * Handle input changes in form fields
   * 
   * @param {Event} e - The input change event
   * 
   * How it works:
   * 1. Extracts 'name' and 'value' from the input element
   * 2. Uses spread operator {...formData} to copy existing form data
   * 3. Updates only the changed field using [name]: value syntax
   * 4. [name] in brackets allows dynamic property access
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Submit handler for adding or updating journeys
   * 
   * @param {Event} e - Form submit event
   * 
   * Logic Flow:
   * 1. Prevent default form submission (page refresh)
   * 2. Check if editing existing journey or creating new one
   * 3. For editing: map through journeys and update matching ID
   * 4. For new: create journey with unique ID and add to array
   * 5. Reset form and close it
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // UPDATE EXISTING JOURNEY
      // map() creates new array, updating only the journey with matching ID
      setJourneys(journeys.map(journey => 
        journey.id === editingId 
          ? { ...journey, ...formData }  // Merge existing data with new form data
          : journey                       // Keep unchanged journeys as-is
      ));
    } else {
      // CREATE NEW JOURNEY
      const newJourney = {
        id: Date.now(), // Simple unique ID using timestamp
        ...formData,
        createdAt: new Date().toISOString()
      };
      setJourneys([...journeys, newJourney]); // Add to end of array
    }
    
    // Reset form state
    resetForm();
  };

  /**
   * Start editing an existing journey
   * 
   * @param {Object} journey - The journey object to edit
   * 
   * Process:
   * 1. Populate form with journey's current data
   * 2. Store journey ID to identify which one we're editing
   * 3. Show the form
   */
  const handleEdit = (journey) => {
    setFormData({
      title: journey.title,
      startDate: journey.startDate,
      endDate: journey.endDate,
      destinations: journey.destinations,
      status: journey.status,
      notes: journey.notes
    });
    setEditingId(journey.id);
    setShowForm(true);
  };

  /**
   * Delete a journey
   * 
   * @param {number} id - ID of journey to delete
   * 
   * Uses filter() to create new array excluding the deleted journey
   * filter() keeps only items where the condition is true
   */
  const handleDelete = (id) => {
    setJourneys(journeys.filter(journey => journey.id !== id));
  };

  /**
   * Reset form to initial empty state
   * Closes form and clears editing mode
   */
  const resetForm = () => {
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      destinations: '',
      status: 'planning',
      notes: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  // ============================================================================
  // FILTERING LOGIC
  // ============================================================================
  
  /**
   * Filter journeys based on selected status
   * 
   * Returns:
   * - All journeys if filter is 'all'
   * - Only journeys matching the selected status otherwise
   * 
   * filter() method creates new array with items that pass the test
   */
  const filteredJourneys = filter === 'all' 
    ? journeys 
    : journeys.filter(journey => journey.status === filter);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  /**
   * Get visual styling for status badges
   * 
   * @param {string} status - Journey status (planning/ongoing/completed)
   * @returns {string} - Tailwind CSS classes for styling
   * 
   * Uses conditional logic to return appropriate color scheme
   */
  const getStatusColor = (status) => {
    switch(status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ============================================================================
  // RENDER - USER INTERFACE
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="text-indigo-600" />
                Journey Tracker
              </h1>
              <p className="text-gray-600 mt-2">Track your adventures and plan your trips</p>
            </div>
            
            {/* Add Journey Button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              {showForm ? 'Cancel' : 'Add Journey'}
            </button>
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {journeys.filter(j => j.status === 'planning').length}
              </div>
              <div className="text-sm text-gray-600">Planning</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {journeys.filter(j => j.status === 'ongoing').length}
              </div>
              <div className="text-sm text-gray-600">Ongoing</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {journeys.filter(j => j.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form - Conditionally rendered based on showForm state */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Edit Journey' : 'Add New Journey'}
            </h2>
            
            {/* Form element with submit handler */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Grid layout for form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Journey Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Journey Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Summer Europe Trip"
                  />
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="planning">Planning</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Start Date Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* End Date Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Destinations Input - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Of Task*
                </label>
                <input
                  type="text"
                  name="End of Task"
                  value={formData.destinations}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Javascript, React, React Native"
                />
              </div>

              {/* Notes Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add any additional details..."
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Check size={20} />
                  {editingId ? 'Update Journey' : 'Add Journey'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Journeys ({journeys.length})
            </button>
            <button
              onClick={() => setFilter('planning')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'planning' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Planning ({journeys.filter(j => j.status === 'planning').length})
            </button>
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'ongoing' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ongoing ({journeys.filter(j => j.status === 'ongoing').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({journeys.filter(j => j.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Journeys List */}
        <div className="space-y-4">
          {filteredJourneys.length === 0 ? (
            // Empty State Message
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No journeys found
              </h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'Start by adding your first journey!'
                  : `No ${filter} journeys yet.`}
              </p>
            </div>
          ) : (
            // Journey Cards - map through filtered journeys
            filteredJourneys.map(journey => (
              <div 
                key={journey.id} 
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Journey Title and Status Badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {journey.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(journey.status)}`}>
                        {journey.status.charAt(0).toUpperCase() + journey.status.slice(1)}
                      </span>
                    </div>

                    {/* Journey Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-indigo-600" />
                        <span>
                          {new Date(journey.startDate).toLocaleDateString()} - {new Date(journey.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag size={16} className="text-indigo-600" />
                        <span>{journey.destinations}</span>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {journey.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{journey.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(journey)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit journey"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(journey.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete journey"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JourneyTracker;
