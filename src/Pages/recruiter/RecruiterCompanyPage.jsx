/**
 * src/Pages/recruiter/RecruiterCompanyPage.jsx
 *
 * Professional Recruiter Company Management Hub.
 * Aligned 100% with Spring Boot CompanyRequestDTO:
 * - companyName, website, logo, industry, companySize, headquarters, foundedYear, email, phone, description, mission, benefits
 * - Real-time fetch of recruiter's company via GET /api/recruiter/company
 * - Interactive Create / Edit Company Form (POST/PUT /api/recruiter/company)
 * - Logo & Cover Image Uploads (POST /api/recruiter/company/logo & /cover)
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Users,
  Globe,
  Plus,
  Upload,
  Image as ImageIcon,
  Edit,
  Save,
  CheckCircle2,
  Sparkles,
  Camera,
  Mail,
  Phone,
  Calendar,
  Target,
  Gift,
} from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import {
  getMyCompany,
  createCompany,
  updateCompany,
  uploadCompanyLogo,
  uploadCompanyCover,
} from "../../State/CompanySlice";
import { useToast } from "../../components/ui/ToastNotification";

export default function RecruiterCompanyPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const user = useAppSelector((state) => state.auth.profile);
  const { myCompany, loading, error } = useAppSelector((state) => state.company);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    logo: "",
    industry: "",
    companySize: "",
    headquarters: "",
    foundedYear: "",
    email: "",
    phone: "",
    description: "",
    mission: "",
    benefits: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    dispatch(getMyCompany());
  }, [dispatch]);

  const userEmail = user?.email || "";
  const companyId = myCompany?.id || myCompany?._id;

  useEffect(() => {
    if (myCompany) {
      setFormData({
        companyName: myCompany.companyName || myCompany.name || "",
        website: myCompany.website || "",
        logo: myCompany.logo || "",
        industry: myCompany.industry || "Software & Technology",
        companySize: myCompany.companySize || "50-200 Employees",
        headquarters: myCompany.headquarters || "Mumbai, Maharashtra, India",
        foundedYear: myCompany.foundedYear || "2020",
        email: myCompany.email || userEmail || "",
        phone: myCompany.phone || "+91 98765 43210",
        description: myCompany.description || "",
        mission: myCompany.mission || "",
        benefits: myCompany.benefits || "",
      });
    }
  }, [companyId, userEmail]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    const payload = {
      companyName: formData.companyName,
      website: formData.website,
      logo: formData.logo,
      industry: formData.industry || "Software & Technology",
      companySize: formData.companySize || "50-200 Employees",
      headquarters: formData.headquarters || "Mumbai, Maharashtra, India",
      foundedYear: formData.foundedYear || "2020",
      email: formData.email || user?.email || "recruiter@company.com",
      phone: formData.phone || "+91 98765 43210",
      description: formData.description || "Leading technology platform.",
      mission: formData.mission || "Building next-generation enterprise solutions.",
      benefits: formData.benefits || "Competitive salary, health insurance, flexible work hours.",
    };

    try {
      if (myCompany) {
        await dispatch(updateCompany(payload)).unwrap();
        toast.success("Company profile updated successfully!");
        setSuccessMsg("Company profile updated successfully!");
      } else {
        await dispatch(createCompany(payload)).unwrap();
        toast.success("Company profile created successfully!");
        setSuccessMsg("Company profile created successfully!");
      }
      setIsEditing(false);
      dispatch(getMyCompany());
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      toast.error(err || "Failed to save company profile.");
      console.error("Save company error:", err);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(uploadCompanyLogo(file)).unwrap();
      toast.success("Company logo uploaded successfully!");
      setSuccessMsg("Logo uploaded successfully!");
      dispatch(getMyCompany());
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      toast.error(err || "Failed to upload logo.");
      console.error("Logo upload error:", err);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(uploadCompanyCover(file)).unwrap();
      toast.success("Company cover image updated!");
      setSuccessMsg("Cover image uploaded successfully!");
      dispatch(getMyCompany());
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      toast.error(err || "Failed to upload cover image.");
      console.error("Cover upload error:", err);
    }
  };

  const company = myCompany || {
    companyName: user?.companyName || "TechNova Solutions",
    description: "Manage your company profile to start posting jobs and attracting top candidate talent.",
    industry: "Software & Artificial Intelligence",
    headquarters: "Mumbai, Maharashtra, India",
    companySize: "50-200 Employees",
    foundedYear: "2020",
    email: user?.email || "recruiter@company.com",
    phone: "+91 98765 43210",
    website: "https://company.com",
    mission: "Empowering global talent through cutting-edge intelligent automation.",
    benefits: "Comprehensive Health Insurance, Stock Options, Remote Flexibility, Learning Stipend.",
  };

  return (
    <RecruiterLayout
      title="Company Profile & Branding"
      subtitle="Manage company details, verification status, logo, mission, and recruiter branding."
      breadcrumbs={[{ label: "Company Profile" }]}
      action={
        <div className="flex items-center gap-2">
          {myCompany && (
            <Link
              to="/upload-job"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:scale-105 transition cursor-pointer font-satoshi"
            >
              <Plus size={16} />
              <span>Post New Job</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 px-4 py-2.5 text-xs font-bold text-indigo-300 hover:bg-indigo-600/30 transition cursor-pointer font-satoshi"
          >
            {isEditing ? <Save size={16} /> : <Edit size={16} />}
            <span>{isEditing ? "Cancel Editing" : myCompany ? "Edit Profile" : "Setup Company"}</span>
          </button>
        </div>
      }
    >
      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-300 font-satoshi shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Edit Form Drawer */}
      {isEditing ? (
        <Card className="p-6 sm:p-8 border-white/10 bg-[#090d16]/95 backdrop-blur-2xl shadow-2xl font-satoshi">
          <form onSubmit={handleSaveCompany} className="space-y-6">
            <h3 className="text-lg font-black text-white font-satoshi border-b border-white/10 pb-3">
              {myCompany ? "Update Company Profile" : "Create New Company Profile"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm font-satoshi">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g. Stripe Technologies"
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Industry Sector *</label>
                <input
                  type="text"
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g. Software / Artificial Intelligence"
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://company.com"
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Headquarters Location</label>
                <input
                  type="text"
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleInputChange}
                  placeholder="Mumbai, Maharashtra, India"
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Company Size</label>
                <input
                  type="text"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  placeholder="50-200 Employees"
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Founded Year</label>
                <input
                  type="text"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleInputChange}
                  placeholder="2020"
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Contact Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="careers@company.com"
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Contact Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Company Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief summary of company mission, tech stack, and values..."
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] p-4 text-sm text-white leading-relaxed font-medium outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Company Mission Statement</label>
                <textarea
                  name="mission"
                  rows={2}
                  value={formData.mission}
                  onChange={handleInputChange}
                  placeholder="e.g. Empowering developers through intelligent automation..."
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] p-4 text-sm text-white leading-relaxed font-medium outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-indigo-300 mb-1.5">Perks & Employee Benefits</label>
                <textarea
                  name="benefits"
                  rows={2}
                  value={formData.benefits}
                  onChange={handleInputChange}
                  placeholder="e.g. Competitive Salary, Stock Options, Remote Work, Health Insurance..."
                  className="w-full rounded-2xl border border-white/15 bg-[#0d1322] p-4 text-sm text-white leading-relaxed font-medium outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:scale-105 transition cursor-pointer font-satoshi"
              >
                <Save size={15} /> Save Company Details
              </button>
            </div>
          </form>
        </Card>
      ) : (
        /* Read-only Executive Card */
        <div className="space-y-6 font-satoshi">
          <Card className="p-6 sm:p-8 border-white/10 bg-[#090d16]/95 backdrop-blur-2xl shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Logo container with file picker */}
              <div className="relative group shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl overflow-hidden font-extrabold text-4xl">
                  {company.logoUrl || company.logo ? (
                    <img src={company.logoUrl || company.logo} alt={company.companyName} className="h-full w-full object-cover" />
                  ) : (
                    company.companyName.charAt(0).toUpperCase()
                  )}
                </div>
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-3xl text-[10px] font-bold text-white transition cursor-pointer">
                  <Camera size={18} />
                  <span>Upload Logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-satoshi">{company.companyName}</h2>
                  <Badge variant="success" icon={ShieldCheck}>
                    Verified Enterprise
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-medium">{company.description}</p>

                <div className="pt-2 flex flex-wrap gap-5 text-xs text-slate-300 font-satoshi font-semibold">
                  <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-indigo-400" /> {company.industry}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-indigo-400" /> {company.headquarters || company.location}</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-indigo-400" /> {company.companySize}</span>
                  {company.foundedYear && (
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-indigo-400" /> Founded {company.foundedYear}</span>
                  )}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-extrabold text-indigo-300 hover:text-white transition">
                      <Globe className="h-4 w-4 text-indigo-400" /> {company.website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Mission & Perks Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Target size={14} /> Company Mission
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{company.mission || "Empowering developers through intelligent automation."}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Gift size={14} /> Employee Benefits & Perks
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{company.benefits || "Competitive Salary, Stock Options, Remote Work, Health Insurance."}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recruiter Team Widget */}
      <Card className="border-white/10 bg-[#090d16]/95 backdrop-blur-2xl font-satoshi">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle className="font-satoshi text-base font-black text-white">Recruiter Team Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 font-black text-base shadow-md">
              {(user?.name || "R").charAt(0)}
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white font-satoshi">{user?.name || "Lead Recruiter"}</h4>
              <p className="text-xs text-indigo-400 font-bold">Recruiter Admin</p>
              <p className="text-xs text-slate-400">{user?.email || company.email || "recruiter@company.com"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </RecruiterLayout>
  );
}
