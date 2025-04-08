import React from 'react'

const DownloadProfile = ({formData}) => {
  
    return (
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div class="flex items-center mb-4">
            <img src={formData.image} alt="Profile Picture Placeholder" class="rounded-full w-24 h-24" />
            <div class="ml-4">
                <div class="text-lg font-semibold">{formData.name}</div>
                <div class="text-gray-500">{formData.aadhar}</div>
            </div>
        </div>
        <form>
            <div class="mb-4">
            <div class="text-gray-500">{formData.email}</div>
            </div>
            <div class="mb-4">
            <div class="text-gray-500">{formData.password}</div>
            </div>
            <div class="flex justify-center">
                <button type="button" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Download</button>
            </div>
        </form>
    </div>

  )
}

export default DownloadProfile