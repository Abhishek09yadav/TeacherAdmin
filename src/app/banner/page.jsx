"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { axiosInstance } from "../../../lib/axios";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./style.css";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [bannerName, setBannerName] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);
  const fetchBanners = () => {
    axiosInstance
      .get("/banners/banners")
      .then((res) => setBanners(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch banners!");
      });
  };

  const handleSave = () => {
    setShowDialog(false);

  

    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to upload this banner?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            addBanner();
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Uploading Cancelled!"),
        },
      ],
    });
  };
  const addBanner = () => {
  const formData = new FormData();
  formData.append("name", bannerName);
  formData.append("image", bannerImage);
  toast.info("Uploading Banner...");
    axiosInstance
      .post("/banners/banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        fetchBanners();
        toast.success("Banner uploaded successfully!");
        console.log("Banner uploaded successfully", res);
      })
      .catch((err) => {
        console.error("Error uploading banner", err);
        toast.error("Failed to upload banner!");
      });


  }
  const deleteBanner = (index) => {
    // const updated = [...banners];
    // updated.splice(index, 1);
    // setBanners(updated);

    axiosInstance
      .delete(`/banners/banner/${banners[index]._id}`)
      .then((res) => {
     
          toast.success("Banner deleted successfully!");
          // fetchBanners();
          const updated = [...banners];
          updated.splice(index, 1);
          setBanners(updated);
       
      })
      .catch((err) => {
        console.log("could not delete banner", err);
        toast.error("Failed to delete banner!");
      });
  };

  const handleDelete = (index) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            deleteBanner(index);
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Deletion Cancelled !"),
        },
      ],
    });
  };

  const bannerGrid = banners.map((banner, index) => {
    return (
      <div
        key={index}
        className={`w-fit min-w-[400px] md:w-6 mb-4 md:mb-6 `}
        style={{ overflow: "hidden" }}
      >
        <div>
          <p className="text-2xl font-bold">{banner.name}</p>
        </div>
        <div className="relative">
          <button
            className="absolute top-2 right-2 text-white hover:text-white z-10 px-5 py-3 bg-red-500 rounded-lg"
            onClick={() => handleDelete(index)}
            style={{
              boxShadow:
                "inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e",
            }}
          >
            <MdDelete size={20} />
          </button>

          <div className="">
            <img
              src={banner.secure_url || banner.image}
              alt={banner.name}
              className="min-w-[400px] w-full h-auto object-cover rounded"
            />
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="p-4 w-[95%] float-end">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Banners</h2>
        <Button
          style={{
            boxShadow:
              "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
          }}
          label="Add Banner"
          icon="pi pi-plus"
          onClick={() => {
            setShowDialog(true);
            setBannerName("");
            setBannerImage(null);
            setPreviewImage(null);
          }}
        />
      </div>

      <div className="flex justify-center items-center gap-5 flex-row flex-wrap">
        {bannerGrid}
      </div>

      <Dialog
        header="Add New Banner"
        visible={showDialog}
        style={{ width: "90%", maxWidth: "500px" }}
        onHide={() => setShowDialog(false)}
        draggable={false}
      >
        <div className="flex flex-col gap-4">
          <span className="p-float-label">
            <InputText
              id="bannerName"
              value={bannerName}
              onChange={(e) => setBannerName(e.target.value)}
            />
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
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={() => setShowDialog(false)}
            />
            <Button
              label="Save"
              onClick={handleSave}
              disabled={!bannerName || !bannerImage}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default BannerManager;
