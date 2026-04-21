import React from 'react';
import { LearningNode } from '../lib/gemini';
import { Clock, BookOpen, Wrench, TerminalSquare } from 'lucide-react';
import './Roadmap.css';

interface RoadmapProps {
  nodes: LearningNode[];
}

export function Roadmap({ nodes }: RoadmapProps) {
  return (
    <div className="roadmap-container">
      <div className="timeline-line"></div>
      
      {nodes.map((node, index) => (
        <div key={index} className={`roadmap-node animate-fade-in delay-${(index % 3 + 1) * 100}`}>
          <div className="node-marker text-gradient">{index + 1}</div>
          
          <div className="node-content glass-panel">
            <div className="node-header">
              <h2>{node.title}</h2>
              <div className="duration-badge">
                <Clock size={14} />
                <span>{node.duration}</span>
              </div>
            </div>
            
            <p className="node-description">{node.description}</p>
            
            <div className="resources-grid">
              {node.courses.length > 0 && (
                <div className="resource-section">
                  <h3 className="section-title">
                    <BookOpen size={16} className="text-gradient" />
                    Courses
                  </h3>
                  <ul className="resource-list">
                    {node.courses.map((course, i) => (
                      <li key={i}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {node.projects.length > 0 && (
                <div className="resource-section">
                  <h3 className="section-title">
                    <Wrench size={16} className="text-gradient" />
                    Projects
                  </h3>
                  <ul className="resource-list">
                    {node.projects.map((project, i) => (
                      <li key={i}>{project}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {node.skills.length > 0 && (
              <div className="skills-section">
                <h3 className="section-title">
                  <TerminalSquare size={16} className="text-gradient" />
                  Skills Acquired
                </h3>
                <div className="skills-flex">
                  {node.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
