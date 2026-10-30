import { useContext } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { CgWebsite } from "react-icons/cg";
import { ResumeContext } from "../../pages/builder";
import ContactInfo from "./ContactInfo";
import DateRange from "../utility/DateRange";
import Language from "./Language";
import Certification from "./Certification";

const icons = [
  { name: "github", icon: <FaGithub /> },
  { name: "linkedin", icon: <FaLinkedin /> },
  { name: "twitter", icon: <FaTwitter /> },
  { name: "facebook", icon: <FaFacebook /> },
  { name: "instagram", icon: <FaInstagram /> },
  { name: "youtube", icon: <FaYoutube /> },
  { name: "website", icon: <CgWebsite /> },
];

// Link text without protocol or trailing slashes; href is built as https://<text>.
const cleanLink = (link) =>
  String(link || "").trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");

// Achievements: one bullet per line, blank lines skipped.
const toLines = (text) =>
  typeof text === "string"
    ? text.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

// Static template for ATS: no drag-and-drop or editable headings. Two layouts share the
// same section renderers; DOM order = text order in the PDF.
// layout="two": header, summary, left column (grid), then right column.
// layout="single": header, summary, then the sections one after another.
const TemplateATS = ({ layout = "two" }) => {
  const { resumeData } = useContext(ResumeContext);

  const summary = resumeData.summary || "";
  const socialMedia = (resumeData.socialMedia || []).filter((item) =>
    cleanLink(item.link)
  );
  const skills = (resumeData.skills || [])
    .map((group) => ({
      title: (group.title || "").trim(),
      items: (group.skills || []).map((s) => (s || "").trim()).filter(Boolean),
    }))
    .filter((group) => group.items.length > 0);
  const languages = resumeData.languages || [];
  const certifications = resumeData.certifications || [];
  const education = resumeData.education || [];
  const workExperience = resumeData.workExperience || [];
  const projects = resumeData.projects || [];

  const renderSkills = () =>
    skills.length > 0 ? (
      <div className="break-inside-avoid">
        <h2 className="section-title mb-1 border-b-2 border-gray-300 break-after-avoid">
          Skills
        </h2>
        {skills.map((group, index) => (
          <p key={index} className="sub-content mb-1">
            {group.title && (
              <>
                <span className="i-bold">{group.title}:</span>{" "}
              </>
            )}
            {group.items.join(", ")}
          </p>
        ))}
      </div>
    ) : null;

  const renderEducation = () =>
    education.length > 0 ? (
      <div className="break-inside-avoid">
        <h2 className="section-title mb-1 border-b-2 border-gray-300 break-after-avoid">
          Education
        </h2>
        {education.map((item, index) => (
          <div key={index} className="mb-1 break-inside-avoid">
            <p className="sub-content i-bold">{item.degree}</p>
            <p className="sub-content">{item.school}</p>
            <DateRange
              startYear={item.startYear}
              endYear={item.endYear}
              id="education-start-end-date"
            />
          </div>
        ))}
      </div>
    ) : null;

  const renderLanguages = () =>
    languages.length > 0 ? (
      <div className="break-inside-avoid">
        <Language title="Languages" languages={languages} />
      </div>
    ) : null;

  const renderCertifications = () =>
    certifications.length > 0 ? (
      <div className="break-inside-avoid">
        <Certification title="Certifications" certifications={certifications} />
      </div>
    ) : null;

  const renderWorkExperience = () =>
    workExperience.length > 0 ? (
      <div>
        <h2 className="section-title mb-1 border-b-2 border-gray-300 break-after-avoid">
          Work Experience
        </h2>
        {workExperience.map((item, index) => {
          const lines = toLines(item.keyAchievements);
          return (
            <div key={index} className="mb-1">
              <div className="break-inside-avoid break-after-avoid">
                <p className="content i-bold">{item.company}</p>
                <p className="content">{item.position}</p>
                <DateRange
                  startYear={item.startYear}
                  endYear={item.endYear}
                  id="work-experience-start-end-date"
                />
              </div>
              {item.description?.trim() && (
                <p className="content break-inside-avoid break-after-avoid">{item.description}</p>
              )}
              {lines.length > 0 && (
                <ul className="list-disc ul-padding content">
                  {lines.map((line, lineIndex) => (
                    <li key={lineIndex} className="break-inside-avoid">
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    ) : null;

  const renderProjects = () =>
    projects.length > 0 ? (
      <div>
        <h2 className="section-title mb-1 border-b-2 border-gray-300 break-after-avoid">
          Projects
        </h2>
        {projects.map((item, index) => {
          const lines = toLines(item.keyAchievements);
          return (
            <div key={index} className="mb-1">
              <div className="break-inside-avoid break-after-avoid">
                <p className="content i-bold">{item.name}</p>
                {cleanLink(item.link) && (
                  <a
                    href={`https://${cleanLink(item.link)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="sub-content text-blue-600"
                  >
                    {cleanLink(item.link)}
                  </a>
                )}
                <DateRange
                  startYear={item.startYear}
                  endYear={item.endYear}
                  id="project-start-end-date"
                />
              </div>
              {item.description?.trim() && (
                <p className="content break-inside-avoid break-after-avoid">{item.description}</p>
              )}
              {lines.length > 0 && (
                <ul className="list-disc ul-padding content">
                  {lines.map((line, lineIndex) => (
                    <li key={lineIndex} className="break-inside-avoid">
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    ) : null;

  const twoColumnHeader = (
    <div className="text-center mb-2">
      <h1 className="name">{resumeData.name}</h1>
      <p className="profession">{resumeData.position}</p>
      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0 contact">
        <ContactInfo
          mainclass="inline-flex flex-wrap justify-center items-center gap-x-3"
          linkclass="inline-flex items-center gap-1"
          teldata={resumeData.contactInformation}
          emaildata={resumeData.email}
          addressdata={resumeData.address}
          telicon={<MdPhone />}
          emailicon={<MdEmail />}
          addressicon={<MdLocationOn />}
        />
        {socialMedia.map((item, index) => (
          <a
            href={`https://${cleanLink(item.link)}`}
            aria-label={item.socialMedia}
            key={index}
            title={item.socialMedia}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-600"
          >
            {icons.map((icon, iconIndex) =>
              icon.name === (item.socialMedia || "").toLowerCase() ? (
                <span key={iconIndex}>{icon.icon}</span>
              ) : null
            )}
            {cleanLink(item.link)}
          </a>
        ))}
      </div>
    </div>
  );

  // Single column: contacts in one line separated by " | ", no icons, empty fields skipped.
  const trimmed = (value) => String(value || "").trim();
  const contacts = [
    trimmed(resumeData.contactInformation) && {
      key: "phone",
      text: trimmed(resumeData.contactInformation),
      href: `tel:${trimmed(resumeData.contactInformation)}`,
      label: "Phone Number",
    },
    trimmed(resumeData.email) && {
      key: "email",
      text: trimmed(resumeData.email),
      href: `mailto:${trimmed(resumeData.email)}`,
      label: "Email Address",
    },
    trimmed(resumeData.address) && { key: "address", text: trimmed(resumeData.address) },
    ...socialMedia.map((item, index) => ({
      key: `social-${index}`,
      text: cleanLink(item.link),
      href: `https://${cleanLink(item.link)}`,
      label: item.socialMedia,
      external: true,
    })),
  ].filter(Boolean);

  const singleHeader = (
    <div className="text-center mb-2">
      <h1 className="name">{resumeData.name}</h1>
      <p className="profession">{resumeData.position}</p>
      <p className="contact">
        {contacts.map((item, index) => (
          <span key={item.key}>
            {index > 0 && " | "}
            {item.href ? (
              <a
                href={item.href}
                aria-label={item.label}
                title={item.label}
                className={item.external ? "text-blue-600" : undefined}
                {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {item.text}
              </a>
            ) : (
              item.text
            )}
          </span>
        ))}
      </p>
    </div>
  );

  const body =
    layout === "single" ? (
      <div className="space-y-2">
        {renderSkills()}
        {renderWorkExperience()}
        {renderProjects()}
        {renderEducation()}
        {renderCertifications()}
        {renderLanguages()}
      </div>
    ) : (
      <div className="grid grid-cols-[31%_1fr] gap-x-6 items-start">
        <div className="space-y-2">
          {renderSkills()}
          {renderEducation()}
          {renderLanguages()}
          {renderCertifications()}
        </div>
        <div className="space-y-2">
          {renderWorkExperience()}
          {renderProjects()}
        </div>
      </div>
    );

  return (
    <div className="w-full h-full resume-page p-4">
      {layout === "single" ? singleHeader : twoColumnHeader}
      <hr className="border-dashed my-2" />
      {summary.trim() && (
        <div className="mb-2">
          <h2 className="section-title mb-1 border-b-2 border-gray-300 break-after-avoid">
            Summary
          </h2>
          <p className="content">{summary}</p>
        </div>
      )}
      {body}
    </div>
  );
};

export default TemplateATS;
