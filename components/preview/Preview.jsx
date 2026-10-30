import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { CgWebsite } from "react-icons/cg";
import Skills from "./Skills";
import DateRange from "../utility/DateRange";
import ContactInfo from "./ContactInfo";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { ResumeContext } from "../../pages/builder";
import dynamic from "next/dynamic";
import Language from "./Language";
import Certification from "./Certification";
import TemplateATS from "./TemplateATS";
import { TEMPLATES, DEFAULT_THEME, resolveTheme } from "../utility/templates";

const DragDropContext = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.DragDropContext;
    }),
  { ssr: false }
);
const Droppable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Droppable;
    }),
  { ssr: false }
);
const Draggable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Draggable;
    }),
  { ssr: false }
);

const Preview = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const theme = resolveTheme(resumeData.theme);
  const currentTemplate = TEMPLATES.some((t) => t.id === theme.template)
    ? theme.template
    : DEFAULT_THEME.template;
  // CSS variables read by .resume-page, .name and .section-title in globals.css.
  // Unset (empty) values fall back to the default look.
  const themeStyle = {
    "--resume-accent": theme.accent || undefined,
    "--resume-bg": theme.background || undefined,
  };
  
  const icons = [
    { name: "github", icon: <FaGithub /> },
    { name: "linkedin", icon: <FaLinkedin /> },
    { name: "twitter", icon: <FaTwitter /> },
    { name: "facebook", icon: <FaFacebook /> },
    { name: "instagram", icon: <FaInstagram /> },
    { name: "youtube", icon: <FaYoutube /> },
    { name: "website", icon: <CgWebsite /> },
  ];

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (source.droppableId === "work-experience") {
      const newWorkExperience = [...resumeData.workExperience];
      const [removed] = newWorkExperience.splice(source.index, 1);
      newWorkExperience.splice(destination.index, 0, removed);
      setResumeData({ ...resumeData, workExperience: newWorkExperience });
    }

    if (source.droppableId.includes("WORK_EXPERIENCE_KEY_ACHIEVEMENT")) {
      const newWorkExperience = [...resumeData.workExperience];
      const workExperienceIndex = parseInt(source.droppableId.split("-")[1]);
      const keyAchievements =
        newWorkExperience[workExperienceIndex].keyAchievements.split("\n");
      const [removed] = keyAchievements.splice(source.index, 1);
      keyAchievements.splice(destination.index, 0, removed);
      newWorkExperience[workExperienceIndex].keyAchievements =
        keyAchievements.join("\n");
      setResumeData({ ...resumeData, workExperience: newWorkExperience });
    }

    if (source.droppableId === "skills") {
      const newSkills = [...resumeData.skills];
      const [removed] = newSkills.splice(source.index, 1);
      newSkills.splice(destination.index, 0, removed);
      setResumeData({ ...resumeData, skills: newSkills });
    }

    if (source.droppableId.includes("projects")) {
      const newProjects = [...resumeData.projects];
      const [removed] = newProjects.splice(source.index, 1);
      newProjects.splice(destination.index, 0, removed);
      setResumeData({ ...resumeData, projects: newProjects });
    }

    if (source.droppableId.includes("PROJECTS_KEY_ACHIEVEMENT")) {
      const newProjects = [...resumeData.projects];
      const projectIndex = parseInt(source.droppableId.split("-")[1]);
      const keyAchievements =
        newProjects[projectIndex].keyAchievements.split("\n");
      const [removed] = keyAchievements.splice(source.index, 1);
      keyAchievements.splice(destination.index, 0, removed);
      newProjects[projectIndex].keyAchievements = keyAchievements.join("\n");
      setResumeData({ ...resumeData, projects: newProjects });
    }
  };

  return (
    <div className="md:max-w-[60%] sticky top-0 preview rm-padding-print p-6 md:overflow-y-scroll md:h-screen">
      <A4PageWrapper style={themeStyle}>
        <DragDropContext onDragEnd={currentTemplate === "template1" ? onDragEnd : () => {}}>
          {currentTemplate === "ats" ? (
            <TemplateATS />
          ) : currentTemplate === "template1" ? (
            <div className="w-full h-full resume-page p-4">
              <div className="text-center mb-2">
                <h1 className="name">{resumeData.name}</h1>
                <p className="profession">{resumeData.position}</p>
                <ContactInfo
                  mainclass="flex flex-row gap-1 contact justify-center"
                  linkclass="inline-flex items-center gap-1"
                  teldata={resumeData.contactInformation}
                  emaildata={resumeData.email}
                  addressdata={resumeData.address}
                  telicon={<MdPhone />}
                  emailicon={<MdEmail />}
                  addressicon={<MdLocationOn />}
                />
                <div className="flex justify-center items-center gap-2 mt-1 text-sm">
                  {resumeData.socialMedia.map((socialMedia, index) => {
                    return (
                      <a
                        href={`http://${socialMedia.link}`}
                        aria-label={socialMedia.socialMedia}
                        key={index}
                        title={socialMedia.socialMedia}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-[2px] text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {icons.map((icon, index) => {
                          if (icon.name === socialMedia.socialMedia.toLowerCase()) {
                            return <span key={index} className="text-sm">{icon.icon}</span>;
                          }
                        })}
                        {socialMedia.link.split('/').pop()}
                      </a>
                    );
                  })}
                </div>
              </div>
              <hr className="border-dashed my-2" />
              {/* two column start */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 space-y-2">
                  {resumeData.summary.length > 0 && (
                    <div className="mb-1">
                      <h2 className="section-title mb-1 border-b-2 border-gray-300">
                        Summary
                      </h2>
                      <p className="content break-words">{resumeData.summary}</p>
                    </div>
                  )}
                  <div>
                    {resumeData.education.length > 0 && (
                      <div className="mb-1">
                        <h2 className="section-title mb-1 border-b-2 border-gray-300">
                          Education
                        </h2>
                        {resumeData.education.map((item, index) => (
                          <div key={index} className="mb-1">
                            <p className="content i-bold">{item.degree}</p>
                            <p className="content">{item.school}</p>
                            <DateRange
                              startYear={item.startYear}
                              endYear={item.endYear}
                              id={`education-start-end-date`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Droppable droppableId="skills" type="SKILLS">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {resumeData.skills.map((skill, index) => (
                          <Draggable
                            key={`SKILLS-${index}`}
                            draggableId={`SKILLS-${index}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-1 ${
                                  snapshot.isDragging &&
                                  "outline-dashed outline-2 outline-gray-400 bg-white"
                                }`}
                              >
                                <Skills title={skill.title} skills={skill.skills} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Language title="Languages" languages={resumeData.languages} />
                  <Certification
                    title="Certifications"
                    certifications={resumeData.certifications}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  {resumeData.workExperience.length > 0 && (
                    <Droppable droppableId="work-experience" type="WORK_EXPERIENCE">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <h2
                            className="section-title mb-1 border-b-2 border-gray-300 editable"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Work Experience
                          </h2>
                          {resumeData.workExperience.map((item, index) => (
                            <Draggable
                              key={`${item.company}-${index}`}
                              draggableId={`WORK_EXPERIENCE-${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-1 ${
                                    snapshot.isDragging &&
                                    "outline-dashed outline-2 outline-gray-400 bg-white"
                                  }`}
                                >
                                  <p className="content i-bold">{item.company}</p>
                                  <p className="content">{item.position}</p>
                                  <DateRange
                                    startYear={item.startYear}
                                    endYear={item.endYear}
                                    id={`work-experience-start-end-date`}
                                  />
                                  <p className="content hyphens-auto">{item.description}</p>
                                  <Droppable
                                    droppableId={`WORK_EXPERIENCE_KEY_ACHIEVEMENT-${index}`}
                                    type="WORK_EXPERIENCE_KEY_ACHIEVEMENT"
                                  >
                                    {(provided) => (
                                      <ul
                                        className="list-disc ul-padding content"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {typeof item.keyAchievements === "string" &&
                                          item.keyAchievements
                                            .split("\n")
                                            .map((achievement, subIndex) => (
                                              <Draggable
                                                key={`${item.company}-${index}-${subIndex}`}
                                                draggableId={`WORK_EXPERIENCE_KEY_ACHIEVEMENT-${index}-${subIndex}`}
                                                index={subIndex}
                                              >
                                                {(provided, snapshot) => (
                                                  <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`
                                              hover:outline-dashed hover:outline-2 hover:outline-gray-400
                                              ${
                                                snapshot.isDragging &&
                                                "outline-dashed outline-2 outline-gray-400 bg-white"
                                              }`}
                                                  >
                                                    {achievement}
                                                  </li>
                                                )}
                                              </Draggable>
                                            ))}
                                        {provided.placeholder}
                                      </ul>
                                    )}
                                  </Droppable>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                  {resumeData.projects.length > 0 && (
                    <Droppable droppableId="projects" type="PROJECTS">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <h2
                            className="section-title mb-1 border-b-2 border-gray-300 editable"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Projects
                          </h2>
                          {resumeData.projects.map((item, index) => (
                            <Draggable
                              key={`${item.name}-${index}`}
                              draggableId={`PROJECTS-${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-1 ${
                                    snapshot.isDragging &&
                                    "outline-dashed outline-2 outline-gray-400 bg-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <p className="content i-bold">{item.name}</p>
                                    {item.link && (
                                      <Link
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                        title={item.link}
                                      >
                                        <FaExternalLinkAlt size={12} />
                                      </Link>
                                    )}
                                  </div>
                                  <DateRange
                                    startYear={item.startYear}
                                    endYear={item.endYear}
                                    id={`work-experience-start-end-date`}
                                  />
                                  <p className="content">{item.description}</p>
                                  <Droppable
                                    droppableId={`PROJECTS_KEY_ACHIEVEMENT-${index}`}
                                    type="PROJECTS_KEY_ACHIEVEMENT"
                                  >
                                    {(provided) => (
                                      <ul
                                        className="list-disc ul-padding content"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {typeof item.keyAchievements === "string" &&
                                          item.keyAchievements
                                            .split("\n")
                                            .map((achievement, subIndex) => (
                                              <Draggable
                                                key={`${item.name}-${index}-${subIndex}`}
                                                draggableId={`PROJECTS_KEY_ACHIEVEMENT-${index}-${subIndex}`}
                                                index={subIndex}
                                              >
                                                {(provided, snapshot) => (
                                                  <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`
                                              hover:outline-dashed hover:outline-2 hover:outline-gray-400
                                              ${
                                                snapshot.isDragging &&
                                                "outline-dashed outline-2 outline-gray-400 bg-white"
                                              }`}
                                                  >
                                                    {achievement}
                                                  </li>
                                                )}
                                              </Draggable>
                                            ))}
                                        {provided.placeholder}
                                      </ul>
                                    )}
                                  </Droppable>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <TemplateATS layout="single" />
          )}
        </DragDropContext>
      </A4PageWrapper>
    </div>
  );
};

const A4PageWrapper = ({ children, style }) => {

  const alertA4Size = () => {
    const preview = document.querySelector(".preview");
    const previewHeight = preview.offsetHeight;
    if (previewHeight > 1122) {
      alert("A4 size exceeded");
    }
  };

  return <div className="w-8.5in" style={style} onLoad={alertA4Size}>{children}</div>;
};

export default Preview;