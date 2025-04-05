'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { axiosInstance } from '../../../lib/axios';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [bannerName, setBannerName] = useState('');
  const [bannerImage, setBannerImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axiosInstance.get('/banners/banners')
      .then(res => setBanners(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSave = () => {
    const newBanner = {
      name: bannerName,
      image: URL.createObjectURL(bannerImage),
    };
    confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
                setBanners([...banners, newBanner]);
                setShowDialog(false);
                setBannerName('');
                setBannerImage(null);
                setPreviewImage(null);
            }
          },
          {
            label: 'No',
            onClick: () => alert('Click No')
          }
        ]
      });

  };

  const handleDelete = (index) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const updated = [...banners];
            updated.splice(index, 1);
            setBanners(updated);
            toast.success("Banner deleted successfully!");
          }
        },
        {
          label: 'No',
          onClick: () => toast.info("Deletion Cancelled !")
        }
      ]
    });
  };

  const bannerGrid = banners.map((banner, index) => (
    <Card
      key={index}
      title={banner.name}
      className="relative min-w-150 md:w-6 mb-4 md:mb-6"
      style={{ overflow: 'hidden' }}
    >
      <button
        className="absolute top-2 right-2 text-white hover:text-white z-10 px-5 py-3 bg-red-500 rounded-lg"
        onClick={() => handleDelete(index)}
      >
        <MdDelete size={20} />
      </button>

      <div className="w-full h-50">
        <img
          src={banner.secure_url || banner.image}
          alt={banner.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
    </Card>
  ));

  return (
    <div className="p-4 w-[95%] float-end">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Banners</h2>
        <Button label="Add Banner" icon="pi pi-plus" onClick={() => setShowDialog(true)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bannerGrid}
      </div>

      <Dialog
        header="Add New Banner"
        visible={showDialog}
        style={{ width: '90%', maxWidth: '500px' }}
        onHide={() => setShowDialog(false)}
      >
        <div className="flex flex-col gap-4">
          <span className="p-float-label">
            <InputText id="bannerName" value={bannerName} onChange={(e) => setBannerName(e.target.value)} />
            <label htmlFor="bannerName">Banner Name</label>
          </span>

          <FileUpload
            mode="basic"
            name="demo[]"
            accept="image/*"
            customUpload
            auto
            chooseLabel="Upload Banner Image"
            onSelect={(e) => {
              const file = e.files[0];
              setBannerImage(file);
              setPreviewImage(URL.createObjectURL(file));
            }}
          />

          {previewImage && (
            <div className="w-full h-40 mt-2">
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded" />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setShowDialog(false)} />
            <Button label="Save" onClick={handleSave} disabled={!bannerName || !bannerImage} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default BannerManager;