"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Edit,
  Trash2,
  Search,
  BarChart3,
  Plus,
  LogIn,
  LogOut,
  Briefcase,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  Clock4,
  Home,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Filter,
  CalendarRange,
  FileSpreadsheet,
  Printer,
  Eye,
} from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Types define karte hain
interface FirebaseEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  status: string;
  supervisor: string;
}

interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: string;
  clockIn: string;
  clockOut: string | null;
  status:
    | "Present"
    | "Late"
    | "Absent"
    | "On Job"
    | "Half Day"
    | "Full Leave"
    | "Sick Leave";
  workingHours: number;
  jobId?: string;
  jobTitle?: string;
  overtimeHours?: number;
  notes?: string;
  attendanceType: "Manual" | "Auto";
  createdAt: string;
  updatedAt: string;
}

export default function AttendancePage() {
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [activeTab, setActiveTab] = useState<
    "daily" | "mark" | "history" | "overtime"
  >("daily");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<FirebaseEmployee[]>([]);

  const [markForm, setMarkForm] = useState({
    employeeId: "",
    clockIn: "",
    clockOut: "",
    jobId: "",
    jobTitle: "",
    overtimeHours: "",
    notes: "",
    status: "Present",
  });

  // ==================== EXPORT SECTION - PROPER EXCEL FORMAT ====================
  const [exportStartDate, setExportStartDate] = useState<string>(
    new Date(new Date().setDate(1)).toISOString().split("T")[0],
  );
  const [exportEndDate, setExportEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [exportType, setExportType] = useState<
    "weekly" | "monthly" | "quarterly" | "custom"
  >("monthly");
  const [exportDepartment, setExportDepartment] = useState<string>("all");
  const [exportStatus, setExportStatus] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  // History tab ke liye new states
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [monthlyReport, setMonthlyReport] = useState<any>(null);

  // Firebase se employees fetch karein
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // Jab date change ho tab attendance refresh karein
  useEffect(() => {
    if (employees.length > 0) {
      ensureAttendanceForAllEmployees();
    }
  }, [currentDate, employees]);

  // Jab month ya employee change ho tab report generate karein
  useEffect(() => {
    if (activeTab === "history" && selectedEmployee) {
      generateMonthlyReport();
    }
  }, [selectedMonth, selectedEmployee, attendance, activeTab]);

  // Update export dates based on type
  useEffect(() => {
    const today = new Date();

    switch (exportType) {
      case "weekly":
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        setExportStartDate(weekAgo.toISOString().split("T")[0]);
        setExportEndDate(today.toISOString().split("T")[0]);
        break;

      case "monthly":
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        setExportStartDate(monthAgo.toISOString().split("T")[0]);
        setExportEndDate(today.toISOString().split("T")[0]);
        break;

      case "quarterly":
        const quarterAgo = new Date(today);
        quarterAgo.setMonth(today.getMonth() - 3);
        setExportStartDate(quarterAgo.toISOString().split("T")[0]);
        setExportEndDate(today.toISOString().split("T")[0]);
        break;

      case "custom":
        // Keep user selected dates
        break;
    }
  }, [exportType]);

  const fetchEmployees = async () => {
    try {
      const employeesRef = collection(db, "employees");
      const snapshot = await getDocs(employeesRef);

      const employeesList: FirebaseEmployee[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "Active") {
          employeesList.push({
            id: doc.id,
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            department: data.department || "",
            position: data.position || "",
            role: data.role || "",
            status: data.status || "Active",
            supervisor: data.supervisor || "",
          });
        }
      });

      setEmployees(employeesList);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const attendanceRef = collection(db, "attendance");
      const snapshot = await getDocs(attendanceRef);

      const attendanceList: Attendance[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const cleanData: any = {};
        Object.keys(data).forEach((key) => {
          if (data[key] !== undefined && data[key] !== null) {
            cleanData[key] = data[key];
          }
        });

        attendanceList.push({
          id: doc.id,
          employeeId: cleanData.employeeId || "",
          employeeName: cleanData.employeeName || "",
          date: cleanData.date || currentDate,
          shift: cleanData.shift || "Standard Shift",
          clockIn: cleanData.clockIn || "",
          clockOut: cleanData.clockOut || null,
          status: cleanData.status || "Absent",
          workingHours: cleanData.workingHours || 0,
          jobId: cleanData.jobId || "",
          jobTitle: cleanData.jobTitle || "",
          overtimeHours: cleanData.overtimeHours || 0,
          notes: cleanData.notes || "",
          attendanceType: cleanData.attendanceType || "Manual",
          createdAt: cleanData.createdAt || new Date().toISOString(),
          updatedAt: cleanData.updatedAt || new Date().toISOString(),
        });
      });

      setAttendance(attendanceList);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendance([]);
    }
  };

  // Ensure all employees have attendance records for today
  const ensureAttendanceForAllEmployees = async () => {
    try {
      const todayAttendance = attendance.filter((a) => a.date === currentDate);
      const attendedEmployeeIds = todayAttendance.map((a) => a.employeeId);

      const employeesWithoutAttendance = employees.filter(
        (emp) => !attendedEmployeeIds.includes(emp.id),
      );

      for (const emp of employeesWithoutAttendance) {
        try {
          const attendanceRef = collection(db, "attendance");
          const q = query(
            attendanceRef,
            where("employeeId", "==", emp.id),
            where("date", "==", currentDate),
          );

          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            const newAttendance = {
              employeeId: emp.id,
              employeeName: emp.name,
              date: currentDate,
              shift: "Standard Shift",
              clockIn: "",
              clockOut: null,
              status: "Absent",
              workingHours: 0,
              jobId: "",
              jobTitle: "",
              overtimeHours: 0,
              notes: "Automatically created",
              attendanceType: "Auto",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await addDoc(
              collection(db, "attendance"),
              cleanFirebaseData(newAttendance),
            );
          }
        } catch (error) {
          console.error(`Error creating attendance for ${emp.name}:`, error);
        }
      }

      await fetchAttendance();
    } catch (error) {
      console.error("Error ensuring attendance:", error);
    }
  };

  // Monthly report generate karein
  const generateMonthlyReport = () => {
    if (!selectedEmployee || !selectedMonth) return;

    const selectedEmp = employees.find((e) => e.id === selectedEmployee);
    if (!selectedEmp) return;

    const [year, month] = selectedMonth.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const daysInMonth = endDate.getDate();
    const monthDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = date.toISOString().split("T")[0];
      monthDays.push(dateStr);
    }

    const employeeAttendance = attendance.filter(
      (a) =>
        a.employeeId === selectedEmployee && a.date.startsWith(selectedMonth),
    );

    const dayData = monthDays.map((date) => {
      const record = employeeAttendance.find((a) => a.date === date);
      const day = new Date(date).getDay();
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];

      return {
        date,
        day: dayName,
        status: record?.status || "Absent",
        clockIn: record?.clockIn || "-",
        clockOut: record?.clockOut || "-",
        workingHours: record?.workingHours || 0,
        notes: record?.notes || "",
        isWeekend: day === 0 || day === 6,
      };
    });

    const summary = {
      present: dayData.filter((d) => d.status === "Present").length,
      absent: dayData.filter((d) => d.status === "Absent").length,
      halfDay: dayData.filter((d) => d.status === "Half Day").length,
      fullLeave: dayData.filter((d) => d.status === "Full Leave").length,
      sickLeave: dayData.filter((d) => d.status === "Sick Leave").length,
      onJob: dayData.filter((d) => d.status === "On Job").length,
      late: dayData.filter((d) => d.status === "Late").length,
      totalWorkingHours: dayData.reduce((sum, d) => sum + d.workingHours, 0),
      weekends: dayData.filter((d) => d.isWeekend).length,
    };

    const workingDays = daysInMonth - summary.weekends;
    const attendedDays =
      summary.present + summary.halfDay + summary.onJob + summary.late;
    const attendanceRate =
      workingDays > 0 ? ((attendedDays / workingDays) * 100).toFixed(1) : "0";

    setMonthlyReport({
      employee: selectedEmp,
      month: selectedMonth,
      days: dayData,
      summary: {
        ...summary,
        workingDays,
        attendanceRate,
        totalDays: daysInMonth,
      },
    });
  };

  // ==================== DOWNLOAD MONTHLY REPORT FUNCTION ====================
  const downloadReport = () => {
    if (!monthlyReport) return;

    const { employee, month, days, summary } = monthlyReport;
    const [year, monthNum] = month.split("-");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[parseInt(monthNum) - 1];

    let csv = `EMPLOYEE ATTENDANCE REPORT\n`;
    csv += `==========================\n\n`;

    csv += `Employee: ${employee.name}\n`;
    csv += `Department: ${employee.department}\n`;
    csv += `Position: ${employee.position}\n`;
    csv += `Month: ${monthName} ${year}\n`;
    csv += `Employee ID: ${employee.id}\n\n`;

    csv += `SUMMARY\n`;
    csv += `-------\n`;
    csv += `Total Working Days:,${summary.workingDays}\n`;
    csv += `Present:,${summary.present}\n`;
    csv += `Absent:,${summary.absent}\n`;
    csv += `Half Day:,${summary.halfDay}\n`;
    csv += `Full Leave:,${summary.fullLeave}\n`;
    csv += `Sick Leave:,${summary.sickLeave}\n`;
    csv += `On Job:,${summary.onJob}\n`;
    csv += `Late:,${summary.late}\n`;
    csv += `Total Working Hours:,${summary.totalWorkingHours.toFixed(1)}\n`;
    csv += `Attendance Rate:,${summary.attendanceRate}%\n\n`;

    csv += `DAILY ATTENDANCE\n`;
    csv += `----------------\n`;
    csv += `Date,Day,Status,Clock In,Clock Out,Working Hours,Notes\n`;

    days.forEach(
      (day: {
        date: any;
        day: any;
        status: any;
        clockIn: any;
        clockOut: any;
        workingHours: any;
        notes: any;
      }) => {
        csv += `${day.date},${day.day},${day.status},${day.clockIn},${day.clockOut},${day.workingHours.toFixed(1)},"${day.notes}"\n`;
      },
    );

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, "_")}_${month}_attendance_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clean data for Firebase - remove undefined and null values
  const cleanFirebaseData = (data: any) => {
    const cleanData: any = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        if (typeof data[key] === "string" && data[key].trim() === "") {
          cleanData[key] = "";
        } else {
          cleanData[key] = data[key];
        }
      } else {
        cleanData[key] = "";
      }
    });
    return cleanData;
  };

  // Get today's attendance
  const todayAttendance = useMemo(() => {
    return attendance.filter((a) => a.date === currentDate);
  }, [attendance, currentDate]);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = employees.map((e) => e.department).filter(Boolean);
    return ["all", ...new Set(depts)];
  }, [employees]);

  // Filter attendance
  const filteredAttendance = useMemo(() => {
    return todayAttendance.filter((a) => {
      const employee = employees.find((e) => e.id === a.employeeId);
      const matchesSearch = a.employeeName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || a.status === filterStatus;
      const matchesDepartment =
        filterDepartment === "all" || employee?.department === filterDepartment;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [todayAttendance, searchTerm, filterStatus, filterDepartment, employees]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const todayAttended = todayAttendance.filter(
      (a) =>
        a.status === "Present" ||
        a.status === "Late" ||
        a.status === "On Job" ||
        a.status === "Half Day",
    ).length;

    return {
      total: totalEmployees,
      present: todayAttendance.filter((a) => a.status === "Present").length,
      late: todayAttendance.filter((a) => a.status === "Late").length,
      absent: todayAttendance.filter((a) => a.status === "Absent").length,
      halfDay: todayAttendance.filter((a) => a.status === "Half Day").length,
      fullLeave: todayAttendance.filter((a) => a.status === "Full Leave")
        .length,
      sickLeave: todayAttendance.filter((a) => a.status === "Sick Leave")
        .length,
      onJob: todayAttendance.filter((a) => a.status === "On Job").length,
      totalOvertimeHours: attendance.reduce(
        (sum, a) => sum + (a.overtimeHours || 0),
        0,
      ),
      attendanceRate:
        totalEmployees > 0
          ? ((todayAttended / totalEmployees) * 100).toFixed(1)
          : "0",
    };
  }, [employees, todayAttendance, attendance]);

  // ==================== EXPORT FUNCTIONALITY - PROPER EXCEL FORMAT ====================
  const handleExportAttendance = async () => {
    setIsExporting(true);

    try {
      // Filter attendance based on date range
      const startDate = new Date(exportStartDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(exportEndDate);
      endDate.setHours(23, 59, 59, 999);

      let filteredAttendance = attendance.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });

      // Filter by department if selected
      if (exportDepartment !== "all") {
        const deptEmployeeIds = employees
          .filter((e) => e.department === exportDepartment)
          .map((e) => e.id);
        filteredAttendance = filteredAttendance.filter((record) =>
          deptEmployeeIds.includes(record.employeeId),
        );
      }

      // Filter by status if selected
      if (exportStatus !== "all") {
        filteredAttendance = filteredAttendance.filter(
          (record) => record.status === exportStatus,
        );
      }

      if (filteredAttendance.length === 0) {
        alert("No attendance records found for the selected criteria");
        setIsExporting(false);
        return;
      }

      // Sort by date and employee name
      filteredAttendance.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.employeeName.localeCompare(b.employeeName);
      });

      // Calculate summary statistics
      const totalDays = new Set(filteredAttendance.map((r) => r.date)).size;
      const totalEmployees = new Set(
        filteredAttendance.map((r) => r.employeeId),
      ).size;
      const totalHours = filteredAttendance.reduce(
        (sum, r) => sum + r.workingHours,
        0,
      );

      // Status counts
      const statusCounts = {
        Present: filteredAttendance.filter((r) => r.status === "Present")
          .length,
        Late: filteredAttendance.filter((r) => r.status === "Late").length,
        Absent: filteredAttendance.filter((r) => r.status === "Absent").length,
        "Half Day": filteredAttendance.filter((r) => r.status === "Half Day")
          .length,
        "Full Leave": filteredAttendance.filter(
          (r) => r.status === "Full Leave",
        ).length,
        "Sick Leave": filteredAttendance.filter(
          (r) => r.status === "Sick Leave",
        ).length,
        "On Job": filteredAttendance.filter((r) => r.status === "On Job")
          .length,
      };

      // Prepare CSV data with proper Excel formatting
      let csv = "";

      // ===== SHEET 1: REPORT SUMMARY =====
      csv += "ATTENDANCE REPORT\n";
      csv += "===================\n\n";

      csv += "REPORT INFORMATION\n";
      csv += "------------------\n";
      csv += `Export Date,${new Date().toLocaleDateString("en-GB")}\n`;
      csv += `Export Time,${new Date().toLocaleTimeString("en-GB")}\n`;
      csv += `Date Range,${formatDate(exportStartDate)} to ${formatDate(exportEndDate)}\n`;
      csv += `Department,${exportDepartment === "all" ? "All Departments" : exportDepartment}\n`;
      csv += `Status Filter,${exportStatus === "all" ? "All Statuses" : exportStatus}\n`;
      csv += `Total Records,${filteredAttendance.length}\n\n`;

      csv += "SUMMARY STATISTICS\n";
      csv += "------------------\n";
      csv += `Total Days in Range,${totalDays}\n`;
      csv += `Total Employees,${totalEmployees}\n`;
      csv += `Total Working Hours,${totalHours.toFixed(2)}\n`;
      csv += `Average Hours per Day,${(totalHours / totalDays).toFixed(2)}\n`;
      csv += `Average Hours per Employee,${(totalHours / totalEmployees).toFixed(2)}\n\n`;

      csv += "ATTENDANCE BREAKDOWN\n";
      csv += "-------------------\n";
      csv += `Present,${statusCounts.Present}\n`;
      csv += `Late,${statusCounts.Late}\n`;
      csv += `Absent,${statusCounts.Absent}\n`;
      csv += `Half Day,${statusCounts["Half Day"]}\n`;
      csv += `Full Leave,${statusCounts["Full Leave"]}\n`;
      csv += `Sick Leave,${statusCounts["Sick Leave"]}\n`;
      csv += `On Job,${statusCounts["On Job"]}\n\n`;

      csv += "ATTENDANCE RATE\n";
      csv += "---------------\n";
      const totalPresent =
        statusCounts.Present +
        statusCounts.Late +
        statusCounts["Half Day"] +
        statusCounts["On Job"];
      const attendanceRate =
        filteredAttendance.length > 0
          ? ((totalPresent / filteredAttendance.length) * 100).toFixed(2)
          : "0";
      csv += `Overall Attendance Rate,${attendanceRate}%\n\n`;

      csv += "=".repeat(50) + "\n\n";

      // ===== SHEET 2: DETAILED ATTENDANCE RECORDS =====
      csv += "DETAILED ATTENDANCE RECORDS\n";
      csv += "===========================\n\n";

      // Headers with proper column names
      csv +=
        [
          "S.No",
          "Date",
          "Day",
          "Employee ID",
          "Employee Name",
          "Department",
          "Position",
          "Status",
          "Clock In",
          "Clock Out",
          "Working Hours",
          "Overtime Hours",
          "Job ID",
          "Job Title",
          "Attendance Type",
          "Notes",
        ].join(",") + "\n";

      // Add data rows with proper formatting
      filteredAttendance.forEach((record, index) => {
        const employee = employees.find((e) => e.id === record.employeeId);
        const date = new Date(record.date);
        const dayName = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][date.getDay()];

        // Format each field properly for Excel
        const row = [
          index + 1,
          `"${formatDate(record.date)}"`,
          `"${dayName}"`,
          `"${record.employeeId}"`,
          `"${record.employeeName}"`,
          `"${employee?.department || ""}"`,
          `"${employee?.position || ""}"`,
          `"${record.status}"`,
          `"${record.clockIn || "-"}"`,
          `"${record.clockOut || "-"}"`,
          record.workingHours.toFixed(2),
          (record.overtimeHours || 0).toFixed(2),
          `"${record.jobId || ""}"`,
          `"${record.jobTitle || ""}"`,
          `"${record.attendanceType}"`,
          `"${(record.notes || "").replace(/"/g, '""')}"`,
        ].join(",");

        csv += row + "\n";
      });

      csv += "\n";
      csv += "=".repeat(50) + "\n\n";

      // ===== SHEET 3: DAILY SUMMARY =====
      csv += "DAILY ATTENDANCE SUMMARY\n";
      csv += "========================\n\n";

      // Group by date
      const dailyData: any = {};
      filteredAttendance.forEach((record) => {
        if (!dailyData[record.date]) {
          dailyData[record.date] = {
            present: 0,
            late: 0,
            absent: 0,
            halfDay: 0,
            fullLeave: 0,
            sickLeave: 0,
            onJob: 0,
            hours: 0,
            employees: new Set(),
          };
        }

        switch (record.status) {
          case "Present":
            dailyData[record.date].present++;
            break;
          case "Late":
            dailyData[record.date].late++;
            break;
          case "Absent":
            dailyData[record.date].absent++;
            break;
          case "Half Day":
            dailyData[record.date].halfDay++;
            break;
          case "Full Leave":
            dailyData[record.date].fullLeave++;
            break;
          case "Sick Leave":
            dailyData[record.date].sickLeave++;
            break;
          case "On Job":
            dailyData[record.date].onJob++;
            break;
        }

        dailyData[record.date].hours += record.workingHours;
        dailyData[record.date].employees.add(record.employeeId);
      });

      // Daily summary headers
      csv +=
        [
          "Date",
          "Day",
          "Total Employees",
          "Present",
          "Late",
          "Absent",
          "Half Day",
          "Full Leave",
          "Sick Leave",
          "On Job",
          "Total Present*",
          "Total Hours",
          "Attendance Rate",
        ].join(",") + "\n";

      // Add daily summary rows
      Object.keys(dailyData)
        .sort()
        .forEach((date) => {
          const d = dailyData[date];
          const dateObj = new Date(date);
          const dayName = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ][dateObj.getDay()];

          const totalPresent = d.present + d.late + d.halfDay + d.onJob;
          const totalEmployeesOnDay = d.employees.size;
          const attendanceRate =
            totalEmployeesOnDay > 0
              ? ((totalPresent / totalEmployeesOnDay) * 100).toFixed(2)
              : "0";

          const row = [
            `"${formatDate(date)}"`,
            `"${dayName}"`,
            totalEmployeesOnDay,
            d.present,
            d.late,
            d.absent,
            d.halfDay || 0,
            d.fullLeave || 0,
            d.sickLeave || 0,
            d.onJob || 0,
            totalPresent,
            d.hours.toFixed(2),
            `${attendanceRate}%`,
          ].join(",");

          csv += row + "\n";
        });

      csv += "\n*Total Present = Present + Late + Half Day + On Job\n\n";

      // ===== SHEET 4: EMPLOYEE SUMMARY =====
      csv += "EMPLOYEE ATTENDANCE SUMMARY\n";
      csv += "===========================\n\n";

      // Group by employee
      const employeeData: any = {};
      filteredAttendance.forEach((record) => {
        if (!employeeData[record.employeeId]) {
          employeeData[record.employeeId] = {
            name: record.employeeName,
            department:
              employees.find((e) => e.id === record.employeeId)?.department ||
              "",
            position:
              employees.find((e) => e.id === record.employeeId)?.position || "",
            present: 0,
            late: 0,
            absent: 0,
            halfDay: 0,
            fullLeave: 0,
            sickLeave: 0,
            onJob: 0,
            hours: 0,
            days: new Set(),
          };
        }

        switch (record.status) {
          case "Present":
            employeeData[record.employeeId].present++;
            break;
          case "Late":
            employeeData[record.employeeId].late++;
            break;
          case "Absent":
            employeeData[record.employeeId].absent++;
            break;
          case "Half Day":
            employeeData[record.employeeId].halfDay++;
            break;
          case "Full Leave":
            employeeData[record.employeeId].fullLeave++;
            break;
          case "Sick Leave":
            employeeData[record.employeeId].sickLeave++;
            break;
          case "On Job":
            employeeData[record.employeeId].onJob++;
            break;
        }

        employeeData[record.employeeId].hours += record.workingHours;
        employeeData[record.employeeId].days.add(record.date);
      });

      // Employee summary headers
      csv +=
        [
          "S.No",
          "Employee ID",
          "Employee Name",
          "Department",
          "Position",
          "Days Present",
          "Days Late",
          "Days Absent",
          "Half Days",
          "Full Leaves",
          "Sick Leaves",
          "On Job Days",
          "Total Working Days*",
          "Total Hours",
          "Average Hours/Day",
          "Attendance Rate",
        ].join(",") + "\n";

      // Add employee summary rows
      let empIndex = 1;
      Object.keys(employeeData)
        .sort((a, b) => {
          const nameA = employeeData[a].name;
          const nameB = employeeData[b].name;
          return nameA.localeCompare(nameB);
        })
        .forEach((empId) => {
          const e = employeeData[empId];
          const totalWorkingDays = e.present + e.late + e.halfDay + e.onJob;
          const totalDaysInRange = e.days.size;
          const avgHoursPerDay =
            totalWorkingDays > 0
              ? (e.hours / totalWorkingDays).toFixed(2)
              : "0";
          const attendanceRate =
            totalDaysInRange > 0
              ? ((totalWorkingDays / totalDaysInRange) * 100).toFixed(2)
              : "0";

          const row = [
            empIndex++,
            `"${empId}"`,
            `"${e.name}"`,
            `"${e.department}"`,
            `"${e.position}"`,
            e.present,
            e.late,
            e.absent,
            e.halfDay || 0,
            e.fullLeave || 0,
            e.sickLeave || 0,
            e.onJob || 0,
            totalWorkingDays,
            e.hours.toFixed(2),
            avgHoursPerDay,
            `${attendanceRate}%`,
          ].join(",");

          csv += row + "\n";
        });

      csv += "\n*Total Working Days = Present + Late + Half Day + On Job\n\n";

      csv += "=".repeat(50) + "\n";
      csv += "END OF REPORT\n";
      csv += "=".repeat(50);

      // Download CSV with proper filename
      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Generate filename with date range
      const startDateStr = exportStartDate.replace(/-/g, "");
      const endDateStr = exportEndDate.replace(/-/g, "");
      const deptStr =
        exportDepartment !== "all"
          ? `_${exportDepartment.replace(/\s+/g, "")}`
          : "";

      link.href = url;
      link.download = `Attendance_Report_${startDateStr}_to_${endDateStr}${deptStr}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      // Show success message with statistics
      alert(
        `✅ Export Successful!\n\n` +
          `📊 Summary:\n` +
          `• Total Records: ${filteredAttendance.length}\n` +
          `• Date Range: ${formatDate(exportStartDate)} to ${formatDate(exportEndDate)}\n` +
          `• Total Days: ${totalDays}\n` +
          `• Total Employees: ${totalEmployees}\n` +
          `• Total Hours: ${totalHours.toFixed(2)} hrs\n\n` +
          `📁 File: Attendance_Report_${startDateStr}_to_${endDateStr}.csv`,
      );
    } catch (error) {
      console.error("Error exporting attendance:", error);
      alert("Error exporting attendance. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle mark attendance
  const handleMarkAttendance = async () => {
    if (!markForm.employeeId || !markForm.status) {
      alert("Please fill in required fields");
      return;
    }

    const employee = employees.find((e) => e.id === markForm.employeeId);
    if (!employee) {
      alert("Employee not found");
      return;
    }

    try {
      const clockInTime =
        markForm.status === "Present" ||
        markForm.status === "Late" ||
        markForm.status === "On Job"
          ? markForm.clockIn || "09:00"
          : "";

      const clockOutTime =
        markForm.status === "Present" ||
        markForm.status === "Late" ||
        markForm.status === "On Job"
          ? markForm.clockOut || "17:00"
          : "";

      let workingHours = 0;
      if (
        (markForm.status === "Present" ||
          markForm.status === "Late" ||
          markForm.status === "On Job") &&
        clockInTime &&
        clockOutTime
      ) {
        const clockIn = new Date(`2024-01-01 ${clockInTime}`);
        const clockOut = new Date(`2024-01-01 ${clockOutTime}`);
        workingHours =
          (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
      } else if (markForm.status === "Half Day") {
        workingHours = 4;
      }

      const attendanceData = cleanFirebaseData({
        employeeId: markForm.employeeId,
        employeeName: employee.name,
        date: currentDate,
        shift: "Standard Shift",
        clockIn: clockInTime,
        clockOut: clockOutTime,
        status: markForm.status,
        workingHours: Math.round(workingHours * 100) / 100,
        jobId: markForm.jobId || "",
        jobTitle: markForm.jobTitle || "",
        overtimeHours: markForm.overtimeHours
          ? parseFloat(markForm.overtimeHours)
          : 0,
        notes: markForm.notes || "",
        attendanceType: "Manual",
        updatedAt: new Date().toISOString(),
      });

      const attendanceRef = collection(db, "attendance");
      const q = query(
        attendanceRef,
        where("employeeId", "==", markForm.employeeId),
        where("date", "==", currentDate),
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, attendanceData);
        alert("Attendance updated successfully!");
      } else {
        const newAttendance = {
          ...attendanceData,
          createdAt: new Date().toISOString(),
        };
        await addDoc(collection(db, "attendance"), newAttendance);
        alert("Attendance marked successfully!");
      }

      setMarkForm({
        employeeId: "",
        clockIn: "",
        clockOut: "",
        jobId: "",
        jobTitle: "",
        overtimeHours: "",
        notes: "",
        status: "Present",
      });

      await fetchAttendance();
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      alert(`Error saving attendance: ${error.message}`);
    }
  };

  // Handle quick status change
  const handleQuickStatusChange = async (
    recordId: string,
    newStatus: Attendance["status"],
  ) => {
    try {
      const record = attendance.find((a) => a.id === recordId);
      if (!record) {
        alert("Record not found");
        return;
      }

      let clockIn = record.clockIn;
      let clockOut = record.clockOut;
      let workingHours = record.workingHours;

      if (
        newStatus === "Present" ||
        newStatus === "Late" ||
        newStatus === "On Job"
      ) {
        if (!clockIn) clockIn = "09:00";
        if (!clockOut) clockOut = "17:00";
        if (clockIn && clockOut) {
          const clockInTime = new Date(`2024-01-01 ${clockIn}`);
          const clockOutTime = new Date(`2024-01-01 ${clockOut}`);
          workingHours =
            (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
        }
      } else if (newStatus === "Half Day") {
        clockIn = clockIn || "09:00";
        clockOut = "13:00";
        workingHours = 4;
      } else {
        clockIn = "";
        clockOut = null;
        workingHours = 0;
      }

      const updateData = cleanFirebaseData({
        status: newStatus,
        clockIn: clockIn,
        clockOut: clockOut,
        workingHours: Math.round(workingHours * 100) / 100,
        attendanceType: "Manual",
        updatedAt: new Date().toISOString(),
      });

      const attendanceDoc = doc(db, "attendance", recordId);
      await updateDoc(attendanceDoc, updateData);

      const updatedRecord = {
        ...record,
        ...updateData,
      };

      const updated = attendance.map((a) =>
        a.id === recordId ? updatedRecord : a,
      );

      setAttendance(updated);
      alert(`Status changed to ${newStatus}`);
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(`Error updating status: ${error.message}`);
    }
  };

  // Handle clock in/out
  const handleClockInOut = async (record: Attendance) => {
    try {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      let updateData: any = {
        updatedAt: new Date().toISOString(),
        attendanceType: "Manual",
      };

      if (!record.clockIn) {
        updateData.clockIn = time;
        updateData.status = "Present";
      } else if (!record.clockOut) {
        updateData.clockOut = time;

        const clockInTime = new Date(`2024-01-01 ${record.clockIn}`);
        const clockOutTime = new Date(`2024-01-01 ${time}`);
        const hours =
          (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
        updateData.workingHours = Math.round(hours * 100) / 100;
      } else {
        updateData.clockIn = "";
        updateData.clockOut = null;
        updateData.workingHours = 0;
      }

      const attendanceDoc = doc(db, "attendance", record.id);
      await updateDoc(attendanceDoc, cleanFirebaseData(updateData));

      const updatedRecord = {
        ...record,
        ...updateData,
      };

      const updated = attendance.map((a) =>
        a.id === record.id ? updatedRecord : a,
      );

      setAttendance(updated);

      if (!record.clockIn) {
        alert("Clock In recorded!");
      } else if (!record.clockOut) {
        alert("Clock Out recorded!");
      } else {
        alert("Clock times reset!");
      }
    } catch (error: any) {
      console.error("Error updating clock in/out:", error);
      alert(`Error recording time: ${error.message}`);
    }
  };

  // Handle delete attendance
  const handleDelete = async (id: string) => {
    if (confirm("Delete this attendance record?")) {
      try {
        await deleteDoc(doc(db, "attendance", id));
        setAttendance((prev) => prev.filter((a) => a.id !== id));
        alert("Attendance record deleted!");
      } catch (error: any) {
        console.error("Error deleting attendance:", error);
        alert(`Error deleting record: ${error.message}`);
      }
    }
  };

  // Bulk mark attendance for all employees
  const handleBulkMark = async (
    status: "Present" | "Absent" | "Half Day" | "Full Leave" | "Sick Leave",
  ) => {
    if (!confirm(`Mark all employees as ${status} for ${currentDate}?`)) return;

    try {
      for (const emp of employees) {
        try {
          const attendanceRef = collection(db, "attendance");
          const q = query(
            attendanceRef,
            where("employeeId", "==", emp.id),
            where("date", "==", currentDate),
          );

          const querySnapshot = await getDocs(q);

          const clockIn = status === "Present" ? "09:00" : "";
          const clockOut = status === "Present" ? "17:00" : "";
          const workingHours =
            status === "Present" ? 8 : status === "Half Day" ? 4 : 0;

          const attendanceData = cleanFirebaseData({
            employeeId: emp.id,
            employeeName: emp.name,
            date: currentDate,
            shift: "Standard Shift",
            clockIn: clockIn,
            clockOut: clockOut,
            status: status,
            workingHours: workingHours,
            jobId: "",
            jobTitle: "",
            overtimeHours: 0,
            notes: `Bulk marked as ${status}`,
            attendanceType: "Manual",
            updatedAt: new Date().toISOString(),
          });

          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, attendanceData);
          } else {
            const newAttendance = {
              ...attendanceData,
              createdAt: new Date().toISOString(),
            };
            await addDoc(collection(db, "attendance"), newAttendance);
          }
        } catch (error) {
          console.error(`Error processing employee ${emp.name}:`, error);
        }
      }

      alert(`All employees marked as ${status} successfully!`);
      await fetchAttendance();
    } catch (error: any) {
      console.error("Error bulk marking:", error);
      alert(`Error bulk marking: ${error.message}`);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Late":
        return "bg-yellow-100 text-yellow-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      case "Half Day":
        return "bg-blue-100 text-blue-700";
      case "Full Leave":
        return "bg-purple-100 text-purple-700";
      case "Sick Leave":
        return "bg-pink-100 text-pink-700";
      case "On Job":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <UserCheck className="h-4 w-4" />;
      case "Absent":
        return <UserX className="h-4 w-4" />;
      case "Half Day":
        return <Clock4 className="h-4 w-4" />;
      case "Full Leave":
        return <Home className="h-4 w-4" />;
      case "Sick Leave":
        return <Coffee className="h-4 w-4" />;
      case "On Job":
        return <Briefcase className="h-4 w-4" />;
      case "Late":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  // Get status color for calendar view
  const getCalendarStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-500 text-white";
      case "Late":
        return "bg-yellow-500 text-white";
      case "Absent":
        return "bg-red-500 text-white";
      case "Half Day":
        return "bg-blue-500 text-white";
      case "Full Leave":
        return "bg-purple-500 text-white";
      case "Sick Leave":
        return "bg-pink-500 text-white";
      case "On Job":
        return "bg-indigo-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Month navigation
  const navigateMonth = (direction: "prev" | "next") => {
    const [year, month] = selectedMonth.split("-").map(Number);
    let newYear = year;
    let newMonth = month;

    if (direction === "prev") {
      if (month === 1) {
        newMonth = 12;
        newYear = year - 1;
      } else {
        newMonth = month - 1;
      }
    } else {
      if (month === 12) {
        newMonth = 1;
        newYear = year + 1;
      } else {
        newMonth = month + 1;
      }
    }

    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Attendance Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track daily attendance, mark status, and manage employee presence
          </p>
          <p className="text-xs text-green-600 mt-1">
            ✅ {employees.length} active employees | 📅 Date: {currentDate}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleBulkMark("Present")}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg"
          >
            <UserCheck className="h-4 w-4" />
            Mark All Present
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">
            Total
          </p>
          <p className="text-2xl font-black text-foreground mt-1">
            {stats.total}
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">
            Present
          </p>
          <p className="text-2xl font-black text-green-600 mt-1">
            {stats.present}
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">
            Half Day
          </p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {stats.halfDay}
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">
            On Job
          </p>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {stats.onJob}
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">
            Leave
          </p>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {stats.fullLeave + stats.sickLeave}
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">
            Late
          </p>
          <p className="text-2xl font-black text-yellow-600 mt-1">
            {stats.late}
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">
            Absent
          </p>
          <p className="text-2xl font-black text-red-600 mt-1">
            {stats.absent}
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-bold uppercase">
            Rate
          </p>
          <p className="text-2xl font-black text-teal-600 mt-1">
            {stats.attendanceRate}%
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleBulkMark("Present")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          <UserCheck className="h-4 w-4" />
          Mark All Present
        </button>
        <button
          onClick={() => handleBulkMark("Absent")}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          <UserX className="h-4 w-4" />
          Mark All Absent
        </button>
        <button
          onClick={() => handleBulkMark("Half Day")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <Clock4 className="h-4 w-4" />
          Mark All Half Day
        </button>
        <button
          onClick={() => handleBulkMark("Full Leave")}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
        >
          <Home className="h-4 w-4" />
          Mark All Leave
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          {[
            { id: "daily", label: "Daily Attendance", icon: Calendar },
            { id: "mark", label: "Mark Attendance", icon: Plus },
            { id: "history", label: "History", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Attendance Tab */}
      {activeTab === "daily" && (
        <div className="space-y-4">
          {/* Date & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1">
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-muted/50 border rounded-xl text-sm"
              />
            </div>
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border rounded-xl text-sm"
              />
            </div>
            <div className="col-span-1 flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-muted/50 border rounded-xl text-sm"
              >
                <option value="all">All Status</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="Full Leave">Full Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="On Job">On Job</option>
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-muted/50 border rounded-xl text-sm"
              >
                <option value="all">All Depts</option>
                {departments
                  .filter((d) => d !== "all")
                  .map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Export Section - CLIENT REQUIREMENT */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-lg">Export Attendance Records</h3>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Client Requirement #6
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Export Type
                </label>
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border rounded-lg text-sm"
                >
                  <option value="weekly">Weekly (Last 7 Days)</option>
                  <option value="monthly">Monthly (Last 30 Days)</option>
                  <option value="quarterly">Quarterly (Last 90 Days)</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  From Date
                </label>
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg text-sm"
                  disabled={exportType !== "custom"}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  To Date
                </label>
                <input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg text-sm"
                  disabled={exportType !== "custom"}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Department
                </label>
                <select
                  value={exportDepartment}
                  onChange={(e) => setExportDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg text-sm"
                >
                  <option value="all">All Departments</option>
                  {departments
                    .filter((d) => d !== "all")
                    .map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Status Filter
                </label>
                <select
                  value={exportStatus}
                  onChange={(e) => setExportStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Full Leave">Full Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="On Job">On Job</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleExportAttendance}
                disabled={isExporting}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold transition-colors"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4" />
                    Export Attendance (Excel Format)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-card border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">
                      #
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">
                      Clock In
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">
                      Clock Out
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">
                      Hours
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">
                      Job
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record, index) => {
                      const employee = employees.find(
                        (e) => e.id === record.employeeId,
                      );
                      return (
                        <tr
                          key={record.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium">
                                {record.employeeName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {employee?.position}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm">
                              {employee?.department || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(record.status)}`}
                            >
                              {getStatusIcon(record.status)}
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono">
                              {record.clockIn || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono">
                              {record.clockOut || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold">
                              {record.workingHours.toFixed(1)}h
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {record.jobTitle ? (
                              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                {record.jobTitle}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleClockInOut(record)}
                                className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                                title={
                                  !record.clockIn
                                    ? "Clock In"
                                    : !record.clockOut
                                      ? "Clock Out"
                                      : "Reset"
                                }
                              >
                                {!record.clockIn ? (
                                  <LogIn className="h-4 w-4" />
                                ) : !record.clockOut ? (
                                  <LogOut className="h-4 w-4" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </button>
                              <select
                                value={record.status}
                                onChange={(e) =>
                                  handleQuickStatusChange(
                                    record.id,
                                    e.target.value as any,
                                  )
                                }
                                className="px-2 py-1 text-xs border rounded-lg bg-white"
                              >
                                <option value="Present">Present</option>
                                <option value="Late">Late</option>
                                <option value="Absent">Absent</option>
                                <option value="Half Day">Half Day</option>
                                <option value="Full Leave">Full Leave</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="On Job">On Job</option>
                              </select>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-12 text-center text-gray-500"
                      >
                        <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">
                          No attendance records for {currentDate}
                        </p>
                        <button
                          onClick={() => handleBulkMark("Present")}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Mark All Present
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Mark Attendance Tab */}
      {activeTab === "mark" && (
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="text-lg font-black mb-6">
            Mark Individual Attendance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-2 block">
                  Employee *
                </label>
                <select
                  value={markForm.employeeId}
                  onChange={(e) =>
                    setMarkForm({ ...markForm, employeeId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department} ({emp.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold mb-2 block">Status *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      value: "Present",
                      label: "Present",
                      color: "bg-green-500",
                    },
                    {
                      value: "Half Day",
                      label: "Half Day",
                      color: "bg-blue-500",
                    },
                    { value: "Absent", label: "Absent", color: "bg-red-500" },
                    {
                      value: "Full Leave",
                      label: "Full Leave",
                      color: "bg-purple-500",
                    },
                    {
                      value: "Sick Leave",
                      label: "Sick Leave",
                      color: "bg-pink-500",
                    },
                    {
                      value: "On Job",
                      label: "On Job",
                      color: "bg-indigo-500",
                    },
                    { value: "Late", label: "Late", color: "bg-yellow-500" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() =>
                        setMarkForm({ ...markForm, status: status.value })
                      }
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${markForm.status === status.value ? status.color + " text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {(markForm.status === "Present" ||
                markForm.status === "Late" ||
                markForm.status === "On Job") && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold mb-2 block">
                        Clock In Time
                      </label>
                      <input
                        type="time"
                        value={markForm.clockIn}
                        onChange={(e) =>
                          setMarkForm({ ...markForm, clockIn: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold mb-2 block">
                        Clock Out Time
                      </label>
                      <input
                        type="time"
                        value={markForm.clockOut}
                        onChange={(e) =>
                          setMarkForm({ ...markForm, clockOut: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold mb-2 block">
                        Job ID (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., JOB001"
                        value={markForm.jobId}
                        onChange={(e) =>
                          setMarkForm({ ...markForm, jobId: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold mb-2 block">
                        Job Title (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Villa Deep Cleaning"
                        value={markForm.jobTitle}
                        onChange={(e) =>
                          setMarkForm({ ...markForm, jobTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-2 block">
                      Overtime Hours (Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.5"
                      value={markForm.overtimeHours}
                      onChange={(e) =>
                        setMarkForm({
                          ...markForm,
                          overtimeHours: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-bold mb-2 block">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any notes..."
                  value={markForm.notes}
                  onChange={(e) =>
                    setMarkForm({ ...markForm, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>
              <button
                onClick={handleMarkAttendance}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!markForm.employeeId}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Attendance
              </button>
            </div>

            {/* Info Box */}
          </div>
        </div>
      )}

      {/* History Tab - Monthly Report */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="bg-card border rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black">
                  Monthly Attendance Report
                </h3>
                <p className="text-sm text-muted-foreground">
                  View detailed attendance history for any employee
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-bold mb-2 block">
                  Select Employee *
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold mb-2 block">
                  Select Month
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="flex-1 px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Employee select nahi hone tak sab hide */}
            {!selectedEmployee ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium text-lg">
                  Select an Employee to View Report
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please choose an employee from the dropdown above to see their
                  monthly attendance report
                </p>
              </div>
            ) : monthlyReport ? (
              <>
                {/* Download Button - Now properly defined */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </button>
                </div>

                {/* Employee Info */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">
                        {monthlyReport.employee.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {monthlyReport.employee.department} •{" "}
                        {monthlyReport.employee.position}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-700">
                        {new Date(
                          `${monthlyReport.month}-01`,
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        Employee ID: {monthlyReport.employee.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="mb-8">
                  <h4 className="font-bold mb-4">Monthly Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                      <p className="text-xs text-green-700 font-bold uppercase">
                        Present
                      </p>
                      <p className="text-xl font-black text-green-600">
                        {monthlyReport.summary.present}
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                      <p className="text-xs text-red-700 font-bold uppercase">
                        Absent
                      </p>
                      <p className="text-xl font-black text-red-600">
                        {monthlyReport.summary.absent}
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                      <p className="text-xs text-blue-700 font-bold uppercase">
                        Half Day
                      </p>
                      <p className="text-xl font-black text-blue-600">
                        {monthlyReport.summary.halfDay}
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                      <p className="text-xs text-purple-700 font-bold uppercase">
                        Leave
                      </p>
                      <p className="text-xl font-black text-purple-600">
                        {monthlyReport.summary.fullLeave +
                          monthlyReport.summary.sickLeave}
                      </p>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                      <p className="text-xs text-indigo-700 font-bold uppercase">
                        On Job
                      </p>
                      <p className="text-xl font-black text-indigo-600">
                        {monthlyReport.summary.onJob}
                      </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                      <p className="text-xs text-yellow-700 font-bold uppercase">
                        Late
                      </p>
                      <p className="text-xl font-black text-yellow-600">
                        {monthlyReport.summary.late}
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <p className="text-xs text-gray-700 font-bold uppercase">
                        Total Hours
                      </p>
                      <p className="text-xl font-black text-gray-600">
                        {monthlyReport.summary.totalWorkingHours.toFixed(1)}h
                      </p>
                    </div>
                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-3">
                      <p className="text-xs text-teal-700 font-bold uppercase">
                        Rate
                      </p>
                      <p className="text-xl font-black text-teal-600">
                        {monthlyReport.summary.attendanceRate}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Calendar View */}
                <div>
                  <h4 className="font-bold mb-4">Daily Attendance Calendar</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center py-2 text-xs font-bold text-gray-600"
                        >
                          {day}
                        </div>
                      ),
                    )}

                    {monthlyReport.days.map((day: any, index: number) => {
                      const dateObj = new Date(day.date);
                      const dayNum = dateObj.getDate();
                      const isToday = day.date === currentDate;

                      return (
                        <div
                          key={day.date}
                          className={`min-h-24 border rounded-lg p-2 ${day.isWeekend ? "bg-gray-50" : "bg-white"} ${isToday ? "ring-2 ring-blue-500" : ""}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span
                              className={`text-sm font-bold ${day.isWeekend ? "text-gray-500" : "text-gray-700"}`}
                            >
                              {dayNum}
                            </span>
                            {isToday && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                                Today
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div
                              className={`text-xs px-1.5 py-0.5 rounded ${getCalendarStatusColor(day.status)}`}
                            >
                              {day.status}
                            </div>

                            {day.status !== "Absent" &&
                              day.status !== "Full Leave" &&
                              day.status !== "Sick Leave" && (
                                <>
                                  <div className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      {day.clockIn}
                                    </span>
                                    <span className="mx-1">-</span>
                                    <span className="font-medium">
                                      {day.clockOut}
                                    </span>
                                  </div>
                                  {day.workingHours > 0 && (
                                    <div className="text-xs text-blue-600 font-medium">
                                      {day.workingHours}h
                                    </div>
                                  )}
                                </>
                              )}

                            {day.notes && (
                              <div
                                className="text-xs text-gray-500 truncate"
                                title={day.notes}
                              >
                                📝 {day.notes.substring(0, 20)}...
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-4 border-t">
                    <h5 className="font-bold mb-2 text-sm">Status Legend</h5>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        <div className="h-3 w-3 rounded-sm bg-green-500"></div>
                        <span>Present</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="h-3 w-3 rounded-sm bg-red-500"></div>
                        <span>Absent</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
                        <span>Half Day</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="h-3 w-3 rounded-sm bg-purple-500"></div>
                        <span>Leave</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="h-3 w-3 rounded-sm bg-indigo-500"></div>
                        <span>On Job</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="h-3 w-3 rounded-sm bg-yellow-500"></div>
                        <span>Late</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="h-3 w-3 rounded-sm bg-pink-500"></div>
                        <span>Sick Leave</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : selectedEmployee ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium text-lg">No Attendance Data Found</p>
                <p className="text-sm text-gray-500 mt-2">
                  No attendance records found for{" "}
                  {employees.find((e) => e.id === selectedEmployee)?.name}
                  in{" "}
                  {new Date(`${selectedMonth}-01`).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try selecting a different month
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
