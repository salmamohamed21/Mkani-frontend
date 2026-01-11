import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaPhone, FaIdCard, FaBirthdayCake, FaEnvelope, FaLock,
  FaHome, FaUsers, FaUserTie, FaMapMarkerAlt, FaBuilding, FaLayerGroup, FaTh,
  FaArrowUp, FaBolt, FaTint, FaFileInvoiceDollar, FaFileContract,
  FaPlus, FaTrash, FaArrowLeft, FaArrowRight, FaTools, FaClock, FaCamera, FaFileAlt,
  FaFingerprint, FaBriefcase, FaCertificate, FaCheck, FaStepBackward, FaStepForward,
  FaCloudUploadAlt
} from "react-icons/fa";
import { registerUserWithFiles } from "../../api/auth";
import { getPublicBuildingNames } from "../../api/buildings";
import BuildingLocationPicker from "../../components/register/BuildingLocationPicker";

const rolesList = [
  { value: "union_head", label: "مالك أو رئيس اتحاد", icon: <FaHome />, color: "from-orange-50 to-orange-100", borderColor: "border-orange-300", textColor: "text-orange-700" },
  { value: "resident", label: "ساكن", icon: <FaUsers />, color: "from-blue-50 to-blue-100", borderColor: "border-blue-300", textColor: "text-blue-700" },
  { value: "technician", label: "فني صيانة", icon: <FaTools />, color: "from-purple-50 to-purple-100", borderColor: "border-purple-300", textColor: "text-purple-700" },
];

const subscriptions = [
  { value: "basic", label: "شهري", price: "50 ج.م" },
  { value: "quarterly", label: "ربع سنوي", price: "100 ج.م" },
  { value: "semi_annual", label: "نصف سنوي", price: "180 ج.م" },
  { value: "annual", label: "سنوي", price: "300 ج.م" },
];

function RegisterStep1({ onNext, form, setForm }) {
  const [buildings, setBuildings] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };
  const handleRoleToggle = (value) => {
    setForm({
      ...form,
      roles: form.roles.includes(value)
        ? form.roles.filter((r) => r !== value)
        : [...form.roles, value],
    });
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("كلمة المرور يجب أن تكون على الأقل 8 أحرف.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على حرف صغير.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على حرف كبير.");
    }
    if (!/\d/.test(password)) {
    }
    if (form.roles.length === 0) {
      alert("اختر دور واحد على الأقل");
      return;
    }
    onNext();
  };

  return (
    <form
      className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8"
