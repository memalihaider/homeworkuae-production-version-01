'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, AlertCircle, User, Star, Award, AlertTriangle, Calendar, Lock, Shield } from 'lucide-react'

export default function TeamReadiness() {
  const [teams, setTeams] = useState<any[]>([
    {
      id: 1,
      name: 'Team A - Commercial',
      supervisor: 'Ahmed Hassan',
      totalMembers: 4,
      members: [
        {
          id: 1,
          name: 'Ali Ahmed',
          role: 'Senior Technician',
          certifications: ['Safety Level 2', 'Advanced Cleaning'],
          complianceScore: 95,
          dressCode: 'Compliant',
          trainingCurrent: true,
          availability: true,
          assignedJobs: 2
        },
        {
          id: 2,
          name: 'Zainab Rashid',
          role: 'Technician',
          certifications: ['Safety Level 1', 'Basic Cleaning'],
          complianceScore: 88,
          dressCode: 'Compliant',
          trainingCurrent: true,
          availability: true,
          assignedJobs: 1
        },
        {
          id: 3,
          name: 'Mohammed Said',
          role: 'Assistant',
          certifications: ['Induction'],
          complianceScore: 72,
          dressCode: 'Non-Compliant',
          trainingCurrent: false,
          availability: false,
          assignedJobs: 0
        }
      ],
      teamReadinessScore: 85,
      certificationCoverage: 80,
      readyForDeployment: true
    },
    {
      id: 2,
      name: 'Team B - Medical',
      supervisor: 'Fatima Al Mansouri',
      totalMembers: 5,
      members: [
        {
          id: 4,
          name: 'Dr. Karim Hassan',
          role: 'Medical Specialist',
          certifications: ['Medical Sanitization', 'Biohazard Level 3', 'Safety'],
          complianceScore: 98,
          dressCode: 'Compliant',
          trainingCurrent: true,
          availability: true,
          assignedJobs: 2
        },
        {
          id: 5,
          name: 'Nurse Amira',
          role: 'Medical Technician',
          certifications: ['Medical Sanitization', 'Biohazard Level 2'],
          complianceScore: 94,
          dressCode: 'Compliant',
          trainingCurrent: true,
          availability: true,
          assignedJobs: 1
        },
        {
          id: 6,
          name: 'Hassan Rashid',
          role: 'Assistant',
          certifications: ['Induction', 'Safety Level 1'],
          complianceScore: 65,
          dressCode: 'Non-Compliant',
          trainingCurrent: false,
          availability: false,
          assignedJobs: 0
        }
      ],
      teamReadinessScore: 91,
      certificationCoverage: 95,
      readyForDeployment: true
    }
  ])

  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null)
  const [showComplianceModal, setShowComplianceModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700'
    if (score >= 75) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const getComplianceStatus = (member: any) => {
    const issues = []
    if (!member.trainingCurrent) issues.push('Training Expired')
    if (member.dressCode === 'Non-Compliant') issues.push('Dress Code Violation')
    if (member.complianceScore < 75) issues.push('Low Compliance Score')
    return issues
  }

  const stats = useMemo(() => ({
    totalTeams: teams.length,
    totalMembers: teams.reduce((sum, t) => sum + t.members.length, 0),
    averageReadiness: Math.round(teams.reduce((sum, t) => sum + t.teamReadinessScore, 0) / teams.length),
    readyForDeployment: teams.filter(t => t.readyForDeployment).length,
    complianceIssues: teams.reduce((sum, t) => sum + t.members.filter((m: any) => getComplianceStatus(m).length > 0).length, 0)
  }), [teams])

  const handleUpdateCompliance = (teamId: number, memberId: number, field: string, value: any) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.map((member: any) => {
            if (member.id === memberId) {
              return { ...member, [field]: value }
            }
            return member
          })
        }
      }
      return team
    }))
  }

  const lockTeamMember = (teamId: number, memberId: number) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.map((member: any) => {
            if (member.id === memberId) {
              return { ...member, availability: false, locked: true }
            }
            return member
          })
        }
      }
      return team
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Team Readiness</h1>
          <p className="text-muted-foreground">Compliance scoring, certification tracking, and grooming standards</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors">
          <Shield className="h-4 w-4" />
          Compliance Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Teams</p>
          <p className="text-2xl font-bold">{stats.totalTeams}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Members</p>
          <p className="text-2xl font-bold">{stats.totalMembers}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Avg. Readiness</p>
          <p className="text-2xl font-bold text-blue-600">{stats.averageReadiness}%</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Ready for Deployment</p>
          <p className="text-2xl font-bold text-green-600">{stats.readyForDeployment}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Compliance Issues</p>
          <p className="text-2xl font-bold text-red-600">{stats.complianceIssues}</p>
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-3">
        {teams.map(team => (
          <div key={team.id} className="bg-card border rounded-lg overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">{team.name}</h3>
                  <p className="text-xs text-muted-foreground">Supervisor: {team.supervisor}</p>
                </div>
                {team.readyForDeployment ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
                <div>
                  <p className="text-muted-foreground">Members</p>
                  <p className="font-semibold">{team.members.length}/{team.totalMembers}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Readiness Score</p>
                  <p className={`font-semibold ${team.teamReadinessScore >= 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {team.teamReadinessScore}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Certification Coverage</p>
                  <p className="font-semibold">{team.certificationCoverage}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${
                    team.readyForDeployment
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {team.readyForDeployment ? 'Ready' : 'Review'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    team.teamReadinessScore >= 85
                      ? 'bg-green-600'
                      : team.teamReadinessScore >= 70
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${team.teamReadinessScore}%` }}
                />
              </div>
            </div>

            {expandedTeamId === team.id && (
              <div className="border-t p-4 space-y-4">
                {/* Team Members */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Team Members</h4>
                  <div className="space-y-3">
                    {team.members.map((member: any) => {
                      const complianceIssues = getComplianceStatus(member)
                      const hasIssues = complianceIssues.length > 0

                      return (
                        <div key={member.id} className={`p-3 rounded-lg border ${hasIssues ? 'border-red-200 bg-red-50' : 'bg-muted'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-sm flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {member.name}
                              </p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${getComplianceColor(member.complianceScore)}`}>
                                {member.complianceScore}% Compliant
                              </span>
                              {hasIssues && member.locked && (
                                <div className="text-red-600 text-xs mt-1 flex items-center gap-1 justify-end">
                                  <Lock className="h-3 w-3" />
                                  Locked
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Certifications */}
                          <div className="mb-2">
                            <p className="text-xs text-muted-foreground mb-1">Certifications</p>
                            <div className="flex flex-wrap gap-1">
                              {member.certifications.map((cert: string, idx: number) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Compliance Issues */}
                          {hasIssues && (
                            <div className="mb-2 p-2 bg-red-100/50 rounded border border-red-200">
                              <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Compliance Issues:
                              </p>
                              <ul className="text-xs text-red-700 space-y-0.5 ml-4">
                                {complianceIssues.map((issue: string, idx: number) => (
                                  <li key={idx}>• {issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Status */}
                          <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                            <div>
                              <p className="text-muted-foreground">Training</p>
                              <span className={member.trainingCurrent ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {member.trainingCurrent ? 'Current' : 'Expired'}
                              </span>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Dress Code</p>
                              <span className={member.dressCode === 'Compliant' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {member.dressCode}
                              </span>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Available</p>
                              <span className={member.availability ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {member.availability ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Assigned</p>
                              <span className="font-semibold">{member.assignedJobs} jobs</span>
                            </div>
                          </div>

                          {/* Actions */}
                          {hasIssues && !member.locked && (
                            <button
                              onClick={() => lockTeamMember(team.id, member.id)}
                              className="w-full mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-1"
                            >
                              <Lock className="h-3 w-3" />
                              Lock for Non-Compliance
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Grooming Compliance Scoring */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Grooming Compliance Score
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground">Uniform</p>
                      <div className="h-1.5 bg-background rounded mt-1 overflow-hidden">
                        <div className="h-full bg-green-600" style={{ width: '90%' }} />
                      </div>
                      <p className="mt-1 font-semibold">90%</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground">Hygiene</p>
                      <div className="h-1.5 bg-background rounded mt-1 overflow-hidden">
                        <div className="h-full bg-green-600" style={{ width: '85%' }} />
                      </div>
                      <p className="mt-1 font-semibold">85%</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground">PPE Usage</p>
                      <div className="h-1.5 bg-background rounded mt-1 overflow-hidden">
                        <div className="h-full bg-green-600" style={{ width: '88%' }} />
                      </div>
                      <p className="mt-1 font-semibold">88%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Exception Reporting */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-bold text-sm text-yellow-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Exception Report
        </h3>
        <div className="space-y-2 text-sm">
          {teams.flatMap(team =>
            team.members
              .filter((m: any) => getComplianceStatus(m).length > 0)
              .map((member: any) => (
                <div key={`${team.id}-${member.id}`} className="flex items-center justify-between p-2 bg-white rounded border border-yellow-100">
                  <span className="text-yellow-900">
                    <strong>{member.name}</strong> ({team.name}) - {getComplianceStatus(member).join(', ')}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-semibold">
                    Action Required
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
