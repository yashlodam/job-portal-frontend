import { ActionIcon, Divider } from "@mantine/core";
import {
  IconBriefcase,
  IconCamera,
  IconCertificate,
  IconDeviceFloppy,
  IconExternalLink,
  IconMapPin,
  IconPencil,
  IconPlus,
  IconSchool,
  IconX,
} from "@tabler/icons-react";

import { MonthPickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import dayjs from "dayjs";

import React, { useRef, useState } from "react";
import { profile } from "../Data/Data";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors";

const textareaClass = `${inputClass} resize-none leading-6`;

const labelClass = "mb-1 block text-xs font-medium text-muted";

function Field({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <p className="mt-3 text-sm italic text-muted">
      {text}
    </p>
  );
}

function Profile() {
  // 0: header  1: about  2: skills  3: experience  4: education  5: certifications
  const [edit, setEdit] = useState([false, false, false, false, false, false]);
  const [data, setData] = useState(profile);
  const [skillDraft, setSkillDraft] = useState("");

  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const handleEdit = (index) => {
    const newEdit = [...edit];
    newEdit[index] = !newEdit[index];
    setEdit(newEdit);
  };

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateListItem = (listKey, index, field, value) => {
    setData((prev) => {
      const list = [...prev[listKey]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [listKey]: list };
    });
  };

  const handleImageSelect = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    updateField(field, previewUrl);
    e.target.value = "";
  };

  const addSkill = () => {
    const value = skillDraft.trim();
    if (!value) return;
    setData((prev) => ({ ...prev, skills: [...(prev.skills || []), value] }));
    setSkillDraft("");
  };

  const removeSkill = (skill) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          role: "",
          company: "",
          startDate: "",
          endDate: "",
          type: "",
          location: "",
          description: "",
          logo: "",
        },
      ],
    }));
    if (!edit[3]) handleEdit(3);
  };

  const removeExperience = (index) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          degree: "",
          college: "",
          university: "",
          startYear: "",
          endYear: "",
          location: "",
        },
      ],
    }));
    if (!edit[4]) handleEdit(4);
  };

  const removeEducation = (index) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    setData((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        {
          title: "",
          issuer: "",
          issuedDate: "",
          credentialId: "",
          credentialUrl: "",
        },
      ],
    }));
    if (!edit[5]) handleEdit(5);
  };

  const removeCertification = (index) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const EditButton = ({ index }) => (
    <ActionIcon
      variant="light"
      radius="xl"
      size="lg"
      className="!bg-white/5 hover:!bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 transition-all duration-300"
      onClick={() => handleEdit(index)}
    >
      {edit[index] ? (
        <IconDeviceFloppy size={20} className="text-cyan-300" />
      ) : (
        <IconPencil size={20} className="text-slate-300" />
      )}
    </ActionIcon>
  );

  const AddButton = ({ onClick }) => (
    <ActionIcon
      variant="light"
      radius="xl"
      size="lg"
      className="!bg-white/5 hover:!bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 transition-all duration-300"
      onClick={onClick}
    >
      <IconPlus size={20} className="text-slate-300" />
    </ActionIcon>
  );

  return (
    <div className="w-4/5 mx-auto">

      {/* Banner + Profile Image */}
      <div className="relative">

        {/* Banner */}
        <div className="group relative h-64 w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-surface">
          {data.bannerImage ? (
            <img
              src={data.bannerImage}
              alt="Profile banner"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              No banner uploaded yet
            </div>
          )}

          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="
              absolute right-4 top-4
              inline-flex items-center gap-1.5
              rounded-lg border border-white/15
              bg-black/50 backdrop-blur-md
              px-3 py-1.5 text-xs font-medium text-white
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
            "
          >
            <IconCamera size={15} />
            Change banner
          </button>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageSelect(e, "bannerImage")}
          />
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-20 left-8">
          <div className="group relative">
            <div
              className="
                h-40 w-40
                overflow-hidden
                rounded-full
                border-[5px]
                border-background
                bg-surface
                shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                sm:h-44
                sm:w-44
                flex items-center justify-center
              "
            >
              {data.profileImage ? (
                <img
                  src={data.profileImage}
                  alt={data.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted px-4 text-center">
                  Add photo
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="
                absolute bottom-1 right-1
                flex h-9 w-9 items-center justify-center
                rounded-full border border-white/15
                bg-black/60 backdrop-blur-md
                text-white
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
              "
            >
              <IconCamera size={16} />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageSelect(e, "profileImage")}
            />
          </div>
        </div>

      </div>

      {/* Space for Profile Image */}
      <div className="h-24" />

      {/* Profile Information */}
      <div className="px-3 sm:px-4">

        {/* Name + Edit Button */}
        <div className="flex items-center justify-between gap-6">

          {/* Name */}
          {edit[0] ? (
            <div className="w-full max-w-sm">
              <Field label="Name">
                <input
                  className={`${inputClass} font-satoshi text-2xl font-bold`}
                  value={data.name}
                  placeholder="e.g. Yash Lodam"
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Field>
            </div>
          ) : (
            <h1
              className="
                font-satoshi
                text-2xl
                font-bold
                tracking-tight
                text-heading
                sm:text-3xl
              "
            >
              {data.name || (
                <span className="text-muted font-normal">Add your name</span>
              )}
            </h1>
          )}

          <EditButton index={0} />

        </div>

        {/* Role + Company */}
        {edit[0] ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Field label="Role">
              <input
                className={`${inputClass} max-w-[220px]`}
                value={data.role}
                placeholder="e.g. Product Designer"
                onChange={(e) => updateField("role", e.target.value)}
              />
            </Field>
            <Field label="Company">
              <input
                className={`${inputClass} max-w-[220px]`}
                value={data.company}
                placeholder="e.g. Acme Inc."
                onChange={(e) => updateField("company", e.target.value)}
              />
            </Field>
          </div>
        ) : data.role || data.company ? (
          <div className="mt-2 flex items-center gap-2 text-sm text-body sm:text-base">
            <IconBriefcase
              size={18}
              stroke={1.7}
              className="shrink-0 text-muted"
            />
            <span className="font-medium">{data.role}</span>
            {data.role && data.company && (
              <span className="text-muted">•</span>
            )}
            <span className="font-medium text-primary-light">
              {data.company}
            </span>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted italic">
            Add your role and company
          </p>
        )}

        {/* Location */}
        {edit[0] ? (
          <div className="mt-2 max-w-[280px]">
            <Field label="Location">
              <input
                className={inputClass}
                value={data.location}
                placeholder="e.g. Pune, India"
                onChange={(e) => updateField("location", e.target.value)}
              />
            </Field>
          </div>
        ) : data.location ? (
          <div className="mt-1.5 flex items-center gap-2 text-sm text-muted sm:text-base">
            <IconMapPin size={18} stroke={1.7} className="shrink-0" />
            <span>{data.location}</span>
          </div>
        ) : (
          <p className="mt-1.5 text-sm text-muted italic">Add your location</p>
        )}

      </div>

      <Divider size="xs" my="xl" color="rgba(148, 163, 184, 0.08)" />

      {/* About Section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
            About
          </h2>
          <EditButton index={1} />
        </div>

        {edit[1] ? (
          <div className="mt-3 max-w-3xl">
            <Field label="About">
              <textarea
                className={textareaClass}
                rows={5}
                value={data.about}
                placeholder="Tell people about your experience, what you're looking for, and what makes you, you."
                onChange={(e) => updateField("about", e.target.value)}
              />
            </Field>
          </div>
        ) : data.about ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-body sm:text-[15px]">
            {data.about}
          </p>
        ) : (
          <EmptyState text="You haven't added a bio yet. Click the pencil to introduce yourself." />
        )}
      </section>

      <Divider size="xs" my="xl" color="rgba(148, 163, 184, 0.08)" />

      {/* Skills Section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
            Skills
          </h2>
          <EditButton index={2} />
        </div>

        {data?.skills?.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-primary/20
                  bg-primary/10
                  px-3.5
                  py-1.5
                  text-sm
                  font-medium
                  text-primary-light
                  transition-all
                  duration-300
                  hover:border-primary/40
                  hover:bg-primary/15
                "
              >
                {skill}
                {edit[2] && (
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-primary-light/70 hover:text-red-400 transition-colors"
                  >
                    <IconX size={14} />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          !edit[2] && (
            <EmptyState text="No skills added yet. Click the pencil to add what you're good at." />
          )
        )}

        {edit[2] && (
          <div className="mt-3 max-w-sm">
            <Field label="Add a skill">
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="e.g. Figma, React, SQL"
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
                <ActionIcon
                  variant="light"
                  radius="xl"
                  size="lg"
                  className="!bg-white/5 hover:!bg-cyan-500/15 border border-white/10 shrink-0"
                  onClick={addSkill}
                >
                  <IconPlus size={18} className="text-slate-300" />
                </ActionIcon>
              </div>
            </Field>
          </div>
        )}
      </section>

      <Divider size="xs" my="xl" color="rgba(148, 163, 184, 0.08)" />

      {/* Experience Section */}
      <div className="flex items-center justify-between">
        <h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
          Experience
        </h2>
        <div className="flex items-center gap-2">
          <AddButton onClick={addExperience} />
          <EditButton index={3} />
        </div>
      </div>

      {data?.experience?.length === 0 && (
        <EmptyState text="No experience added yet. Click the + to add your first role." />
      )}

      {data?.experience?.map((item, index) => (
        <section key={index}>
          <div className="mt-6 space-y-8">

            {/* Experience Item */}
            <div className="flex gap-4">

              {/* Company Logo */}
              <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-xl border border-border bg-surface p-2">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.company}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <IconBriefcase size={22} className="text-muted" />
                )}
              </div>

              {/* Experience Details */}
              <div className="flex-1">

                {edit[3] ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <Field label="Role">
                          <input
                            className={`${inputClass} max-w-[220px]`}
                            value={item.role}
                            placeholder="e.g. Software Engineer"
                            onChange={(e) =>
                              updateListItem("experience", index, "role", e.target.value)
                            }
                          />
                        </Field>
                        <Field label="Company">
                          <input
                            className={`${inputClass} max-w-[220px]`}
                            value={item.company}
                            placeholder="e.g. Google"
                            onChange={(e) =>
                              updateListItem("experience", index, "company", e.target.value)
                            }
                          />
                        </Field>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="shrink-0 text-muted hover:text-red-400 transition-colors"
                      >
                        <IconX size={18} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Field label="Start Date">
                        <MonthPickerInput
                          value={item.startDate ? new Date(item.startDate) : null}
                          valueFormat="MMM YYYY"
                          placeholder="Select month"
                          className="max-w-[180px]"
                          clearable
                          onChange={(value) =>
                            updateListItem(
                              "experience",
                              index,
                              "startDate",
                              value || ""
                            )
                          }
                        />
                      </Field>

                      <Field label="End Date">
                        <MonthPickerInput
                          value={item.endDate ? new Date(item.endDate) : null}
                          valueFormat="MMM YYYY"
                          placeholder="Select month"
                          className="max-w-[180px]"
                          clearable
                          onChange={(value) =>
                            updateListItem(
                              "experience",
                              index,
                              "endDate",
                              value || ""
                            )
                          }
                        />
                      </Field>
                      <Field label="Type">
                        <input
                          className={`${inputClass} max-w-[140px]`}
                          value={item.type}
                          placeholder="e.g. Full-time"
                          onChange={(e) =>
                            updateListItem("experience", index, "type", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Location">
                        <input
                          className={`${inputClass} max-w-[180px]`}
                          value={item.location}
                          placeholder="e.g. Remote"
                          onChange={(e) =>
                            updateListItem("experience", index, "location", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Description">
                      <textarea
                        className={`${textareaClass} max-w-3xl`}
                        rows={3}
                        value={item.description}
                        placeholder="What did you work on? What did you ship or improve?"
                        onChange={(e) =>
                          updateListItem("experience", index, "description", e.target.value)
                        }
                      />
                    </Field>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-satoshi text-base font-semibold text-heading sm:text-lg">
                          {item.role || "Untitled role"}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-primary-light">
                          {item.company}
                        </p>
                      </div>
                      <span className="text-sm text-muted">
                        {item.startDate
                          ? dayjs(item.startDate).format("MMM YYYY")
                          : "Start"}

                        {" - "}

                        {item.endDate
                          ? dayjs(item.endDate).format("MMM YYYY")
                          : "Present"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted sm:text-sm">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.location}</span>
                    </div>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-body">
                      {item.description}
                    </p>
                  </>
                )}

              </div>

            </div>

          </div>
        </section>
      ))}

      <Divider size="xs" my="xl" color="rgba(148, 163, 184, 0.08)" />

      {/* Education Section */}
      <div className="flex items-center justify-between">
        <h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
          Education
        </h2>
        <div className="flex items-center gap-2">
          <AddButton onClick={addEducation} />
          <EditButton index={4} />
        </div>
      </div>

      {data?.education?.length === 0 && (
        <EmptyState text="No education added yet. Click the + to add your first degree." />
      )}

      {data?.education?.map((item, index) => (
        <section key={index}>
          <div className="mt-6 space-y-8">

            {/* Education Item */}
            <div className="flex items-start gap-4">

              {/* Education Icon */}
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-primary/20
                  bg-primary/10
                  text-primary-light
                "
              >
                <IconSchool size={24} stroke={1.6} />
              </div>

              {/* Education Details */}
              <div className="min-w-0 flex-1">

                {edit[4] ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Field label="Degree">
                        <input
                          className={`${inputClass} max-w-sm`}
                          value={item.degree}
                          placeholder="e.g. B.E. Computer Engineering"
                          onChange={(e) =>
                            updateListItem("education", index, "degree", e.target.value)
                          }
                        />
                      </Field>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="shrink-0 text-muted hover:text-red-400 transition-colors mt-6"
                      >
                        <IconX size={18} />
                      </button>
                    </div>
                    <Field label="College">
                      <input
                        className={`${inputClass} max-w-sm`}
                        value={item.college}
                        placeholder="e.g. Late G.N. Sapkal College of Engineering"
                        onChange={(e) =>
                          updateListItem("education", index, "college", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="University">
                      <input
                        className={`${inputClass} max-w-sm`}
                        value={item.university}
                        placeholder="e.g. Savitribai Phule Pune University"
                        onChange={(e) =>
                          updateListItem("education", index, "university", e.target.value)
                        }
                      />
                    </Field>
                    <div className="flex flex-wrap gap-2">
                      <Field label="Start year">
                        <input
                          className={`${inputClass} max-w-[120px]`}
                          value={item.startYear}
                          placeholder="e.g. 2019"
                          onChange={(e) =>
                            updateListItem("education", index, "startYear", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="End year">
                        <input
                          className={`${inputClass} max-w-[120px]`}
                          value={item.endYear}
                          placeholder="e.g. 2023"
                          onChange={(e) =>
                            updateListItem("education", index, "endYear", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Location">
                        <input
                          className={`${inputClass} max-w-[180px]`}
                          value={item.location}
                          placeholder="e.g. Pune, India"
                          onChange={(e) =>
                            updateListItem("education", index, "location", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-satoshi text-base font-semibold text-heading sm:text-lg">
                          {item.degree || "Untitled degree"}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-primary-light">
                          {item.college}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm text-muted">
                        {item.startYear} — {item.endYear}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-body">{item.university}</p>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                      <IconMapPin size={16} stroke={1.7} />
                      <span>{item.location}</span>
                    </div>
                  </>
                )}

              </div>

            </div>

          </div>
        </section>
      ))}

      <Divider size="xs" my="xl" color="rgba(148, 163, 184, 0.08)" />

      {/* Certifications Section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
            Certifications
          </h2>
          <div className="flex items-center gap-2">
            <AddButton onClick={addCertification} />
            <EditButton index={5} />
          </div>
        </div>

        {data?.certifications?.length === 0 && (
          <EmptyState text="No certifications added yet. Click the + to add one." />
        )}

        <div className="mt-6 space-y-6">

          {data?.certifications?.map((cert, index) => (
            <div key={index} className="flex items-start gap-4">

              {/* Certificate Icon */}
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-primary/20
                  bg-primary/10
                  text-primary-light
                "
              >
                <IconCertificate size={24} stroke={1.6} />
              </div>

              {/* Certificate Information */}
              <div className="min-w-0 flex-1">

                {edit[5] ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Field label="Certificate title">
                        <input
                          className={`${inputClass} max-w-sm`}
                          value={cert.title}
                          placeholder="e.g. Google Cloud Professional Developer"
                          onChange={(e) =>
                            updateListItem("certifications", index, "title", e.target.value)
                          }
                        />
                      </Field>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="shrink-0 text-muted hover:text-red-400 transition-colors mt-6"
                      >
                        <IconX size={18} />
                      </button>
                    </div>
                    <Field label="Issuer">
                      <input
                        className={`${inputClass} max-w-sm`}
                        value={cert.issuer}
                        placeholder="e.g. Google Cloud"
                        onChange={(e) =>
                          updateListItem("certifications", index, "issuer", e.target.value)
                        }
                      />
                    </Field>
                    <div className="flex flex-wrap gap-2">
                      <Field label="Issued date">
                        <input
                          className={`${inputClass} max-w-[180px]`}
                          value={cert.issuedDate}
                          placeholder="e.g. Jan 2025"
                          onChange={(e) =>
                            updateListItem("certifications", index, "issuedDate", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Credential ID">
                        <input
                          className={`${inputClass} max-w-[220px]`}
                          value={cert.credentialId}
                          placeholder="e.g. GCP-DEV-2025"
                          onChange={(e) =>
                            updateListItem("certifications", index, "credentialId", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Credential URL">
                        <input
                          className={`${inputClass} max-w-[240px]`}
                          value={cert.credentialUrl}
                          placeholder="https://..."
                          onChange={(e) =>
                            updateListItem("certifications", index, "credentialUrl", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-satoshi text-base font-semibold text-heading sm:text-lg">
                          {cert.title || "Untitled certificate"}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-primary-light">
                          {cert.issuer}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm text-muted">
                        Issued {cert.issuedDate}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-muted">
                      Credential ID: {cert.credentialId}
                    </p>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          mt-3
                          inline-flex
                          items-center
                          gap-1.5
                          text-sm
                          font-semibold
                          text-primary-light
                          transition-colors
                          hover:text-primary
                        "
                      >
                        Show credential
                        <IconExternalLink size={15} stroke={1.8} />
                      </a>
                    )}
                  </>
                )}

              </div>

            </div>
          ))}

        </div>
      </section>
    </div>
  );
}

export default Profile;