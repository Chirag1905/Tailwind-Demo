import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
    getCampusGroupRequest,
    postCampusGroupRequest,
    postCampusGroupSuccess,
    postRealmRequest
} from '@/Redux/features/campusGroup/campusGroupSlice';

const CampusGroupCreate = (props) => {
    const {
        openModal,
        closeModal,
    } = props;

    // Redux state
    const dispatch = useDispatch();
    const { campusGroupPostData, loading, error } = useSelector((state) => state.campusGroup);
    const { token } = useSelector((state) => state.auth);
    // Component state
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        campusGroupName: "",
        licenseCount: "",
        gpsEnabled: false,
        zoomEnabled: false,
        isActive: false,
        inheritEmailSettings: false,
        inheritGoogleOAuth: false,
        enableGPS: false,
        enableGoogleMeet: false,
        enableSMSTemplateEdit: false,
        enableSMSTemplateID: false,
        assignedDomains: "",
    });

    // Function to update form data
    const updateFormData = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const params = {
                campusGroupName: formData.campusGroupName,
                licenseCount: formData.licenseCount,
                gpsEnabled: formData.gpsEnabled,
                zoomEnabled: formData.zoomEnabled,
                isActive: formData.isActive,
            };
            dispatch(postCampusGroupRequest({ data: params, token }));
        } catch (err) {
            console.error("Error submitting data:", err);
            toast.error(err || "Failed to submit data. Please try again.", {
                position: "top-right",
                duration: 2000,
            });
        }
    };

    // Handle API responses
    useEffect(() => {
        if (!campusGroupPostData?.message) return;

        toast.success(campusGroupPostData.message, {
            position: "top-right",
            duration: 5000,
        });

        // Refresh campus data
        dispatch(getCampusGroupRequest({
            data: {
                page: 0,
                size: 10,
                sortBy: "id",
                ascending: true,
            },
        }));

        dispatch(postCampusGroupSuccess(null));
        closeModal();
    }, [campusGroupPostData, closeModal]);

    // Handle API errors
    useEffect(() => {
        if (!error) return;

        if (Array.isArray(error.error)) {
            error.error.forEach((err) => {
                toast.error(`${err.field || 'Error'}: ${err.message}`, {
                    position: "top-right",
                    duration: 2000,
                });
            });
        } else if (error.message) {
            toast.error(error.message, { position: "top-right", duration: 2000 });
        } else {
            toast.error("An unexpected error occurred", { position: "top-right", duration: 2000 });
        }
    }, [error]);

    return (
        <>
            <div className='py-6 md:py-10 px-4 md:px-10 mt-6 md:mt-10 bg-card-color rounded-lg'>
                <div className='my-6 md:my-10 px-2 md:px-4 lg:px-20 max-h-[60svh] md:max-h-[80svh] overflow-auto cus-scrollbar'>
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <div className='text-lg md:text-2xl font-medium'>
                            New Campus
                        </div>
                    </div>

                    {/* Flex container for tabs and content - changes to column on mobile */}
                    <div className="flex flex-col md:flex-row">
                        {/* Left Side Tabs - full width on mobile, 1/4 on desktop */}
                        <div className="w-full md:w-1/4 bg-card-color md:border-r border-border-color mb-4 md:mb-0">
                            <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-4 p-2 md:p-4 overflow-x-auto md:overflow-x-visible">
                                {['Profile', 'Domain', 'Plugins', 'Email', 'SMS Setting', 'Plugin Settings', 'Gateways'].map((tab, index) => (
                                    <button
                                        key={index}
                                        className={`py-2 px-3 md:px-4 text-sm md:text-base text-left rounded-md whitespace-nowrap ${activeTab === index
                                            ? 'bg-primary-color text-secondary'
                                            : 'text-primary hover:text-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        onClick={() => setActiveTab(index)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side Content - full width on mobile, 3/4 on desktop */}
                        <div className="w-full md:w-3/4 p-2 md:p-4">
                            {activeTab === 0 && (
                                <div className="flex flex-col space-y-4">
                                    <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-0 md:px-4'>
                                        <label htmlFor='campaignsTitle' className='form-label md:w-1/3'>
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className='form-control w-full md:w-2/3'>
                                            <input
                                                type='text'
                                                placeholder='Campus Name'
                                                className='form-input'
                                                value={formData?.campusGroupName || ""}
                                                onChange={(e) => updateFormData("campusGroupName", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-0 md:px-4'>
                                        <label htmlFor='campaignsTitle' className='form-label md:w-1/3'>
                                            License Count <span className="text-red-500">*</span>
                                        </label>
                                        <div className='form-control w-full md:w-2/3'>
                                            <input
                                                type='number'
                                                placeholder='license count'
                                                className='form-input'
                                                value={formData?.licenseCount || ""}
                                                onChange={(e) => updateFormData("licenseCount", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-0 md:px-4'>
                                        <label htmlFor='campaignsTitle' className='form-label md:w-1/3'>
                                            GPS Enabled <span className="text-red-500">*</span>
                                        </label>
                                        <div className='form-check form-switch w-full md:w-2/3 flex items-center'>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={formData?.gpsEnabled || false}
                                                onChange={(e) => updateFormData("gpsEnabled", e.target.checked)}
                                            />
                                            <label className="form-check-label ml-2" htmlFor="lightIndoor1">
                                                {formData?.gpsEnabled ? "Enabled" : "Disabled"}
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-0 md:px-4'>
                                        <label htmlFor='campaignsTitle' className='form-label md:w-1/3'>
                                            Zoom Meeting Enabled <span className="text-red-500">*</span>
                                        </label>
                                        <div className='form-check form-switch w-full md:w-2/3 flex items-center'>
                                            <input
                                                type='checkbox'
                                                className='form-check-input'
                                                checked={formData?.zoomEnabled || false}
                                                onChange={(e) => updateFormData("zoomEnabled", e.target.checked)}
                                            />
                                            <label className="form-check-label ml-2" htmlFor="lightIndoor1">
                                                {formData?.zoomEnabled ? "Enabled" : "Disabled"}
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-0 md:px-4'>
                                        <label htmlFor='campaignsTitle' className='form-label md:w-1/3'>
                                            IsActive <span className="text-red-500">*</span>
                                        </label>
                                        <div className='form-check form-switch w-full md:w-2/3 flex items-center'>
                                            <input
                                                type='checkbox'
                                                className='form-check-input'
                                                checked={formData?.isActive || false}
                                                onChange={(e) => updateFormData("isActive", e.target.checked)}
                                            />
                                            <label className="form-check-label ml-2" htmlFor="lightIndoor1">
                                                {formData?.isActive ? "Enabled" : "Disabled"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 1 && (
                                <div>
                                    <div className='form-control'>
                                        <label className='form-label'>
                                            Assigned Domains
                                        </label>
                                        <div className='relative w-full'>
                                            <input
                                                type='text'
                                                className='form-input'
                                                checked={formData?.domain || ""}
                                                onChange={(e) => updateFormData("domain", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 2 && (
                                <div>
                                    <div className='form-control'>
                                        <div className='flex flex-col md:flex-row justify-between mb-4 gap-2 md:gap-0'>
                                            <label className='form-label'>
                                                Assign Plugins
                                            </label>
                                            <label className='form-label'>
                                                All | Name
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* Plugins would go here */}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 3 && (
                                <div>
                                    <div className='form-control'>
                                        <div className="flex flex-col sm:flex-row gap-4 border border-border-color rounded-md p-4 bg-body-color">
                                            <div className="form-check flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="campaignsEmail"
                                                    className="form-check-input"
                                                />
                                                <label className="form-check-label ml-2" htmlFor="campaignsEmail">
                                                    Inherit Email Settings
                                                </label>
                                            </div>
                                            <div className="form-check flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="campaignsGoogle"
                                                    className="form-check-input"
                                                />
                                                <label className="form-check-label ml-2" htmlFor="campaignsGoogle">
                                                    Inherit Google OAuth
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 4 && (
                                <div>
                                    <div className='form-control'>
                                        <label className='form-label'>
                                            SMS Settings
                                        </label>
                                        <div className="flex flex-col sm:flex-row gap-4 border border-border-color rounded-md p-4 bg-body-color">
                                            <div className="form-check flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="campaignsSMS"
                                                    className="form-check-input"
                                                />
                                                <label className="form-check-label ml-2" htmlFor="campaignsSMS">
                                                    Enable SMS Template Edit
                                                </label>
                                            </div>
                                            <div className="form-check flex items-center">
                                                <input
                                                    type="radio"
                                                    name="campaignsSMSID"
                                                    className="form-check-input"
                                                />
                                                <label className="form-check-label ml-2" htmlFor="campaignsSMSID">
                                                    Enable SMS Template ID
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 5 && (
                                <div>
                                    <div className='form-control'>
                                        <div className="flex flex-col sm:flex-row gap-4 border border-border-color rounded-md p-4 bg-body-color">
                                            <div className="form-check flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="campaignsGps"
                                                    className="form-check-input"
                                                />
                                                <label className="form-check-label ml-2" htmlFor="campaignsGps">
                                                    Enable GPS
                                                </label>
                                            </div>
                                            <div className="form-check flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="campaignsMeet"
                                                    className="form-check-input"
                                                />
                                                <label className="form-check-label ml-2" htmlFor="campaignsMeet">
                                                    Enable Google Meet
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 6 && (
                                <div>
                                    <div className='form-control'>
                                        <label className='form-label'>
                                            Gateways
                                        </label>
                                        <div className="flex flex-col sm:flex-row gap-4 border border-border-color rounded-md p-4 bg-body-color">
                                            <div className="form-check flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="campaignsZoom"
                                                    className="form-check-input"
                                                />
                                                <label className="form-check-label ml-2" htmlFor="campaignsZoom">
                                                    Enable Zoom Meeting
                                                </label>
                                            </div>
                                            <div className="form-check flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="campaignsGoogleMeet"
                                                    className="form-check-input"
                                                />
                                                <label className="form-check-label ml-2" htmlFor="campaignsGoogleMeet">
                                                    Enable Google Meet
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons Section */}
                    <div className='flex flex-col sm:flex-row items-stretch gap-3 mt-6'>
                        <button
                            onClick={closeModal}
                            className='btn btn-secondary flex-1 sm:flex-none'
                        >
                            Close
                        </button>
                        <button
                            className='btn btn-primary flex-1 sm:flex-none'
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CampusGroupCreate;