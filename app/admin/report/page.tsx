// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Calendar,
//   Download,
//   RefreshCw,
//   TrendingUp,
//   DollarSign,
//   Package,
//   Users,
//   Briefcase,
//   BarChart3,
//   PieChart,
//   ChevronDown,
//   X,
//   Menu,
//   Mail,
//   User,
//   Sparkles,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   ArrowUp,
//   ArrowDown,
//   Layers
// } from 'lucide-react';
// import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from 'date-fns';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart as RePieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area
// } from 'recharts';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { getSession } from '@/lib/auth';
// import * as XLSX from 'xlsx';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';


// // ============================================
// // INTERFACES
// // ============================================

// interface Job {
//   id: string;
//   title: string;
//   client: string;
//   clientId: string;
//   status: string;
//   priority: string;
//   budget: number;
//   actualCost: number;
//   createdAt: string;
//   completedAt?: string;
//   scheduledDate?: string;
//   teamRequired: number;
//   location: string;
//   description: string;
// }

// interface Service {
//   id: string;
//   name: string;
//   categoryName: string;
//   price: number;
//   cost: number;
//   stock: number;
//   minStock: number;
//   status: string;
//   type: string;
//   unit: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   categoryName: string;
//   price: number;
//   cost: number;
//   stock: number;
//   minStock: number;
//   status: string;
//   type: string;
//   unit: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Booking {
//   id: string;
//   bookingId: string;
//   name: string;
//   email: string;
//   phone: string;
//   service: string;
//   date: string;
//   time: string;
//   status: string;
//   area: string;
//   propertyType: string;
//   frequency: string;
//   message: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface DateRange {
//   start: Date;
//   end: Date;
//   label: string;
// }

// // ============================================
// // MAIN COMPONENT
// // ============================================

// export default function FinanceAnalyticsPage() {
//   const router = useRouter();
//   const [session, setSession] = useState<any>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
  
//   // Data states
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [bookings, setBookings] = useState<Booking[]>([]);
  
//   // UI states
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [dateRange, setDateRange] = useState<DateRange>({
//     start: startOfMonth(new Date()),
//     end: endOfMonth(new Date()),
//     label: 'This Month'
//   });
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [customStartDate, setCustomStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
//   const [customEndDate, setCustomEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
//   const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'services' | 'bookings'>('overview');

//   // Date range presets
//   const datePresets = [
//     { label: 'Today', start: new Date(), end: new Date() },
//     { label: 'Yesterday', start: subDays(new Date(), 1), end: subDays(new Date(), 1) },
//     { label: 'This Week', start: startOfWeek(new Date(), { weekStartsOn: 1 }), end: endOfWeek(new Date(), { weekStartsOn: 1 }) },
//     { label: 'This Month', start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
//     { label: 'Last Month', start: startOfMonth(subMonths(new Date(), 1)), end: endOfMonth(subMonths(new Date(), 1)) },
//     { label: 'This Year', start: startOfYear(new Date()), end: endOfYear(new Date()) },
//     { label: 'All Time', start: new Date(2020, 0, 1), end: new Date() },
//   ];

//   // Session check
//   useEffect(() => {
//     const storedSession = getSession();
//     if (!storedSession) {
//       router.push('/login');
//       return;
//     }
//     setSession(storedSession);
//   }, [router]);

//   // Fetch all data
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchJobs(),
//         fetchServices(),
//         fetchProducts(),
//         fetchBookings()
//       ]);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchJobs = async () => {
//     try {
//       const jobsRef = collection(db, 'jobs');
//       const snapshot = await getDocs(jobsRef);
//       const jobsData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })) as Job[];
//       setJobs(jobsData);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     }
//   };

//   const fetchServices = async () => {
//     try {
//       const servicesRef = collection(db, 'services');
//       const snapshot = await getDocs(servicesRef);
//       const servicesData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })) as Service[];
//       setServices(servicesData);
//     } catch (error) {
//       console.error('Error fetching services:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const productsRef = collection(db, 'products');
//       const snapshot = await getDocs(productsRef);
//       const productsData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })) as Product[];
//       setProducts(productsData);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   const fetchBookings = async () => {
//     try {
//       const bookingsRef = collection(db, 'bookings');
//       const snapshot = await getDocs(bookingsRef);
//       const bookingsData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })) as Booking[];
//       setBookings(bookingsData);
//     } catch (error) {
//       console.error('Error fetching bookings:', error);
//     }
//   };

//   // Filter data by date range
//   const filterByDateRange = <T extends { createdAt?: string }>(
//     items: T[]
//   ): T[] => {
//     return items.filter(item => {
//       const dateStr = item.createdAt;
//       if (!dateStr) return false;
      
//       const itemDate = new Date(dateStr);
//       return itemDate >= dateRange.start && itemDate <= dateRange.end;
//     });
//   };

//   // Apply date filter to all data
//   const filteredJobs = useMemo(() => filterByDateRange(jobs), [jobs, dateRange]);
//   const filteredServices = useMemo(() => filterByDateRange(services), [services, dateRange]);
//   const filteredProducts = useMemo(() => filterByDateRange(products), [products, dateRange]);
//   const filteredBookings = useMemo(() => filterByDateRange(bookings), [bookings, dateRange]);

//   // ============================================
//   // THIS WEEK DATA
//   // ============================================

//   const thisWeekRange = useMemo(() => ({
//     start: startOfWeek(new Date(), { weekStartsOn: 1 }),
//     end: endOfWeek(new Date(), { weekStartsOn: 1 })
//   }), []);

//   const thisWeekJobs = useMemo(() => 
//     jobs.filter(job => {
//       if (!job.createdAt) return false;
//       const jobDate = new Date(job.createdAt);
//       return jobDate >= thisWeekRange.start && jobDate <= thisWeekRange.end;
//     }), [jobs, thisWeekRange]);

//   const thisWeekServices = useMemo(() => 
//     services.filter(service => {
//       if (!service.createdAt) return false;
//       const serviceDate = new Date(service.createdAt);
//       return serviceDate >= thisWeekRange.start && serviceDate <= thisWeekRange.end;
//     }), [services, thisWeekRange]);

//   const thisWeekProducts = useMemo(() => 
//     products.filter(product => {
//       if (!product.createdAt) return false;
//       const productDate = new Date(product.createdAt);
//       return productDate >= thisWeekRange.start && productDate <= thisWeekRange.end;
//     }), [products, thisWeekRange]);

//   const thisWeekBookings = useMemo(() => 
//     bookings.filter(booking => {
//       if (!booking.createdAt) return false;
//       const bookingDate = new Date(booking.createdAt);
//       return bookingDate >= thisWeekRange.start && bookingDate <= thisWeekRange.end;
//     }), [bookings, thisWeekRange]);

//   const thisWeekMetrics = useMemo(() => ({
//     jobs: {
//       count: thisWeekJobs.length,
//       revenue: thisWeekJobs.reduce((sum, job) => sum + (job.budget || 0), 0),
//       profit: thisWeekJobs.reduce((sum, job) => sum + ((job.budget || 0) - (job.actualCost || 0)), 0)
//     },
//     services: {
//       count: thisWeekServices.length,
//       revenue: thisWeekServices.reduce((sum, service) => sum + ((service.price || 0) * (service.stock || 1)), 0),
//       profit: thisWeekServices.reduce((sum, service) => sum + (((service.price || 0) - (service.cost || 0)) * (service.stock || 1)), 0)
//     },
//     products: {
//       count: thisWeekProducts.length,
//       revenue: thisWeekProducts.reduce((sum, product) => sum + ((product.price || 0) * (product.stock || 0)), 0),
//       profit: thisWeekProducts.reduce((sum, product) => sum + (((product.price || 0) - (product.cost || 0)) * (product.stock || 0)), 0),
//       itemsSold: thisWeekProducts.reduce((sum, product) => sum + (product.stock || 0), 0)
//     },
//     bookings: {
//       count: thisWeekBookings.length,
//       pending: thisWeekBookings.filter(b => b.status === 'pending').length,
//       completed: thisWeekBookings.filter(b => b.status === 'completed').length
//     }
//   }), [thisWeekJobs, thisWeekServices, thisWeekProducts, thisWeekBookings]);

//   // ============================================
//   // FINANCIAL CALCULATIONS
//   // ============================================

//   const financialMetrics = useMemo(() => {
//     // Jobs financials
//     const totalJobBudget = filteredJobs.reduce((sum, job) => sum + (job.budget || 0), 0);
//     const totalJobActualCost = filteredJobs.reduce((sum, job) => sum + (job.actualCost || 0), 0);
//     const jobProfit = totalJobBudget - totalJobActualCost;
//     const jobProfitMargin = totalJobBudget > 0 ? (jobProfit / totalJobBudget) * 100 : 0;

//     // Services financials
//     const totalServiceRevenue = filteredServices.reduce((sum, service) => sum + (service.price || 0) * (service.stock || 1), 0);
//     const totalServiceCost = filteredServices.reduce((sum, service) => sum + (service.cost || 0) * (service.stock || 1), 0);
//     const serviceProfit = totalServiceRevenue - totalServiceCost;
//     const serviceProfitMargin = totalServiceRevenue > 0 ? (serviceProfit / totalServiceRevenue) * 100 : 0;

//     // Products financials
//     const totalProductRevenue = filteredProducts.reduce((sum, product) => sum + (product.price || 0) * (product.stock || 0), 0);
//     const totalProductCost = filteredProducts.reduce((sum, product) => sum + (product.cost || 0) * (product.stock || 0), 0);
//     const productProfit = totalProductRevenue - totalProductCost;
//     const productProfitMargin = totalProductRevenue > 0 ? (productProfit / totalProductRevenue) * 100 : 0;

//     // Bookings count
//     const totalBookings = filteredBookings.length;
//     const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length;
//     const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;

//     // Overall
//     const totalRevenue = totalJobBudget + totalServiceRevenue + totalProductRevenue;
//     const totalCost = totalJobActualCost + totalServiceCost + totalProductCost;
//     const totalProfit = totalRevenue - totalCost;
//     const overallProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

//     return {
//       jobs: {
//         count: filteredJobs.length,
//         budget: totalJobBudget,
//         actualCost: totalJobActualCost,
//         profit: jobProfit,
//         profitMargin: jobProfitMargin,
//         completed: filteredJobs.filter(j => j.status === 'Completed').length,
//         inProgress: filteredJobs.filter(j => j.status === 'In Progress').length,
//         pending: filteredJobs.filter(j => j.status === 'Pending').length,
//       },
//       services: {
//         count: filteredServices.length,
//         revenue: totalServiceRevenue,
//         cost: totalServiceCost,
//         profit: serviceProfit,
//         profitMargin: serviceProfitMargin,
//         active: filteredServices.filter(s => s.status === 'ACTIVE').length,
//       },
//       products: {
//         count: filteredProducts.length,
//         revenue: totalProductRevenue,
//         cost: totalProductCost,
//         profit: productProfit,
//         profitMargin: productProfitMargin,
//         totalStock: filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0),
//         lowStock: filteredProducts.filter(p => (p.stock || 0) <= (p.minStock || 0)).length,
//       },
//       bookings: {
//         total: totalBookings,
//         pending: pendingBookings,
//         completed: completedBookings,
//         conversionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
//       },
//       overall: {
//         revenue: totalRevenue,
//         cost: totalCost,
//         profit: totalProfit,
//         profitMargin: overallProfitMargin,
//       },
//     };
//   }, [filteredJobs, filteredServices, filteredProducts, filteredBookings]);

//   // ============================================
//   // CHART DATA
//   // ============================================

//   // Revenue by category (pie chart)
//   const revenueByCategory = useMemo(() => {
//     return [
//       { name: 'Jobs', value: financialMetrics.jobs.budget, color: '#3b82f6' },
//       { name: 'Services', value: financialMetrics.services.revenue, color: '#10b981' },
//       { name: 'Products', value: financialMetrics.products.revenue, color: '#f59e0b' },
//     ].filter(item => item.value > 0);
//   }, [financialMetrics]);

//   // Profit by category (bar chart)
//   const profitByCategory = useMemo(() => {
//     return [
//       { name: 'Jobs', profit: financialMetrics.jobs.profit, margin: financialMetrics.jobs.profitMargin },
//       { name: 'Services', profit: financialMetrics.services.profit, margin: financialMetrics.services.profitMargin },
//       { name: 'Products', profit: financialMetrics.products.profit, margin: financialMetrics.products.profitMargin },
//     ];
//   }, [financialMetrics]);

//   // Monthly trend data
//   const monthlyTrendData = useMemo(() => {
//     const months: { [key: string]: { revenue: number; cost: number; profit: number } } = {};
    
//     // Process jobs
//     filteredJobs.forEach(job => {
//       if (job.createdAt) {
//         const month = format(new Date(job.createdAt), 'MMM yyyy');
//         if (!months[month]) months[month] = { revenue: 0, cost: 0, profit: 0 };
//         months[month].revenue += job.budget || 0;
//         months[month].cost += job.actualCost || 0;
//       }
//     });

//     // Process services
//     filteredServices.forEach(service => {
//       if (service.createdAt) {
//         const month = format(new Date(service.createdAt), 'MMM yyyy');
//         if (!months[month]) months[month] = { revenue: 0, cost: 0, profit: 0 };
//         months[month].revenue += (service.price || 0) * (service.stock || 1);
//         months[month].cost += (service.cost || 0) * (service.stock || 1);
//       }
//     });

//     // Process products
//     filteredProducts.forEach(product => {
//       if (product.createdAt) {
//         const month = format(new Date(product.createdAt), 'MMM yyyy');
//         if (!months[month]) months[month] = { revenue: 0, cost: 0, profit: 0 };
//         months[month].revenue += (product.price || 0) * (product.stock || 0);
//         months[month].cost += (product.cost || 0) * (product.stock || 0);
//       }
//     });

//     // Calculate profit
//     Object.keys(months).forEach(month => {
//       months[month].profit = months[month].revenue - months[month].cost;
//     });

//     // Convert to array and sort by date
//     return Object.entries(months)
//       .map(([month, data]) => ({ month, ...data }))
//       .sort((a, b) => {
//         const dateA = new Date(a.month);
//         const dateB = new Date(b.month);
//         return dateA.getTime() - dateB.getTime();
//       });
//   }, [filteredJobs, filteredServices, filteredProducts]);

//   // Job status distribution
//   const jobStatusData = useMemo(() => {
//     const statusCount: { [key: string]: number } = {};
//     filteredJobs.forEach(job => {
//       statusCount[job.status] = (statusCount[job.status] || 0) + 1;
//     });
    
//     const colors: { [key: string]: string } = {
//       'Completed': '#10b981',
//       'In Progress': '#3b82f6',
//       'Pending': '#f59e0b',
//       'Scheduled': '#8b5cf6',
//       'Cancelled': '#ef4444',
//     };

//     return Object.entries(statusCount).map(([name, value]) => ({
//       name,
//       value,
//       color: colors[name] || '#6b7280'
//     }));
//   }, [filteredJobs]);

//   // Top performing services
//   const topServices = useMemo(() => {
//     return [...filteredServices]
//       .sort((a, b) => (b.price || 0) - (a.price || 0))
//       .slice(0, 5)
//       .map(s => ({
//         name: s.name,
//         revenue: (s.price || 0) * (s.stock || 1),
//         profit: ((s.price || 0) - (s.cost || 0)) * (s.stock || 1),
//       }));
//   }, [filteredServices]);

//   // ============================================
//   // EXCEL EXPORT
//   // ============================================

//   const exportToExcel = () => {
//     const wb = XLSX.utils.book_new();

//     // Summary Sheet
//     const summaryData = [
//       ['FINANCE ANALYTICS REPORT'],
//       [`Generated on: ${format(new Date(), 'dd MMM yyyy HH:mm')}`],
//       [`Date Range: ${format(dateRange.start, 'dd MMM yyyy')} - ${format(dateRange.end, 'dd MMM yyyy')}`],
//       [],
//       ['OVERALL METRICS'],
//       ['Metric', 'Value'],
//       ['Total Revenue', `AED ${financialMetrics.overall.revenue.toLocaleString()}`],
//       ['Total Cost', `AED ${financialMetrics.overall.cost.toLocaleString()}`],
//       ['Total Profit', `AED ${financialMetrics.overall.profit.toLocaleString()}`],
//       ['Profit Margin', `${financialMetrics.overall.profitMargin.toFixed(2)}%`],
//       [],
//       ['JOBS METRICS'],
//       ['Metric', 'Value'],
//       ['Total Jobs', financialMetrics.jobs.count],
//       ['Completed Jobs', financialMetrics.jobs.completed],
//       ['In Progress Jobs', financialMetrics.jobs.inProgress],
//       ['Pending Jobs', financialMetrics.jobs.pending],
//       ['Total Budget', `AED ${financialMetrics.jobs.budget.toLocaleString()}`],
//       ['Total Actual Cost', `AED ${financialMetrics.jobs.actualCost.toLocaleString()}`],
//       ['Job Profit', `AED ${financialMetrics.jobs.profit.toLocaleString()}`],
//       ['Job Profit Margin', `${financialMetrics.jobs.profitMargin.toFixed(2)}%`],
//       [],
//       ['SERVICES METRICS'],
//       ['Metric', 'Value'],
//       ['Total Services', financialMetrics.services.count],
//       ['Active Services', financialMetrics.services.active],
//       ['Service Revenue', `AED ${financialMetrics.services.revenue.toLocaleString()}`],
//       ['Service Cost', `AED ${financialMetrics.services.cost.toLocaleString()}`],
//       ['Service Profit', `AED ${financialMetrics.services.profit.toLocaleString()}`],
//       ['Service Profit Margin', `${financialMetrics.services.profitMargin.toFixed(2)}%`],
//       [],
//       ['PRODUCTS METRICS'],
//       ['Metric', 'Value'],
//       ['Total Products', financialMetrics.products.count],
//       ['Total Stock', financialMetrics.products.totalStock],
//       ['Low Stock Items', financialMetrics.products.lowStock],
//       ['Product Revenue', `AED ${financialMetrics.products.revenue.toLocaleString()}`],
//       ['Product Cost', `AED ${financialMetrics.products.cost.toLocaleString()}`],
//       ['Product Profit', `AED ${financialMetrics.products.profit.toLocaleString()}`],
//       ['Product Profit Margin', `${financialMetrics.products.profitMargin.toFixed(2)}%`],
//       [],
//       ['BOOKINGS METRICS'],
//       ['Metric', 'Value'],
//       ['Total Bookings', financialMetrics.bookings.total],
//       ['Pending Bookings', financialMetrics.bookings.pending],
//       ['Completed Bookings', financialMetrics.bookings.completed],
//       ['Conversion Rate', `${financialMetrics.bookings.conversionRate.toFixed(2)}%`],
//     ];
//     const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
//     XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

//     // Jobs Sheet
//     if (filteredJobs.length > 0) {
//       const jobsSheetData = [
//         ['ID', 'Title', 'Client', 'Status', 'Priority', 'Budget (AED)', 'Actual Cost (AED)', 'Profit (AED)', 'Team Required', 'Location', 'Created At'],
//         ...filteredJobs.map(job => [
//           job.id,
//           job.title,
//           job.client,
//           job.status,
//           job.priority,
//           job.budget || 0,
//           job.actualCost || 0,
//           (job.budget || 0) - (job.actualCost || 0),
//           job.teamRequired || 0,
//           job.location || '',
//           job.createdAt ? format(new Date(job.createdAt), 'dd/MM/yyyy') : '',
//         ])
//       ];
//       const jobsSheet = XLSX.utils.aoa_to_sheet(jobsSheetData);
//       XLSX.utils.book_append_sheet(wb, jobsSheet, 'Jobs');
//     }

//     // Services Sheet
//     if (filteredServices.length > 0) {
//       const servicesSheetData = [
//         ['ID', 'Name', 'Category', 'Price (AED)', 'Cost (AED)', 'Profit (AED)', 'Margin %', 'Stock', 'Status', 'Created At'],
//         ...filteredServices.map(service => {
//           const profit = (service.price || 0) - (service.cost || 0);
//           const margin = service.price ? (profit / service.price) * 100 : 0;
//           return [
//             service.id,
//             service.name,
//             service.categoryName || '',
//             service.price || 0,
//             service.cost || 0,
//             profit,
//             margin.toFixed(2),
//             service.stock || 0,
//             service.status || '',
//             service.createdAt ? format(new Date(service.createdAt), 'dd/MM/yyyy') : '',
//           ];
//         })
//       ];
//       const servicesSheet = XLSX.utils.aoa_to_sheet(servicesSheetData);
//       XLSX.utils.book_append_sheet(wb, servicesSheet, 'Services');
//     }

//     // Products Sheet
//     if (filteredProducts.length > 0) {
//       const productsSheetData = [
//         ['ID', 'Name', 'Category', 'Price (AED)', 'Cost (AED)', 'Profit (AED)', 'Margin %', 'Stock', 'Min Stock', 'Status', 'Created At'],
//         ...filteredProducts.map(product => {
//           const profit = (product.price || 0) - (product.cost || 0);
//           const margin = product.price ? (profit / product.price) * 100 : 0;
//           return [
//             product.id,
//             product.name,
//             product.categoryName || '',
//             product.price || 0,
//             product.cost || 0,
//             profit,
//             margin.toFixed(2),
//             product.stock || 0,
//             product.minStock || 0,
//             product.status || '',
//             product.createdAt ? format(new Date(product.createdAt), 'dd/MM/yyyy') : '',
//           ];
//         })
//       ];
//       const productsSheet = XLSX.utils.aoa_to_sheet(productsSheetData);
//       XLSX.utils.book_append_sheet(wb, productsSheet, 'Products');
//     }

//     // Bookings Sheet
//     if (filteredBookings.length > 0) {
//       const bookingsSheetData = [
//         ['Booking ID', 'Customer', 'Email', 'Phone', 'Service', 'Date', 'Time', 'Status', 'Area', 'Property Type', 'Created At'],
//         ...filteredBookings.map(booking => [
//           booking.bookingId || booking.id,
//           booking.name || '',
//           booking.email || '',
//           booking.phone || '',
//           booking.service || '',
//           booking.date || '',
//           booking.time || '',
//           booking.status || '',
//           booking.area || '',
//           booking.propertyType || '',
//           booking.createdAt ? format(new Date(booking.createdAt), 'dd/MM/yyyy') : '',
//         ])
//       ];
//       const bookingsSheet = XLSX.utils.aoa_to_sheet(bookingsSheetData);
//       XLSX.utils.book_append_sheet(wb, bookingsSheet, 'Bookings');
//     }

//     // Save file
//     XLSX.writeFile(wb, `Finance_Report_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`);
//   };

//   // ============================================
//   // DATE RANGE HANDLERS
//   // ============================================

//   const applyDatePreset = (preset: typeof datePresets[0]) => {
//     setDateRange({
//       start: preset.start,
//       end: preset.end,
//       label: preset.label
//     });
//     setShowDatePicker(false);
//   };

//   const applyCustomDateRange = () => {
//     setDateRange({
//       start: new Date(customStartDate),
//       end: new Date(customEndDate),
//       label: 'Custom Range'
//     });
//     setShowDatePicker(false);
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchAllData();
//     setRefreshing(false);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading financial data...</p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // RENDER
//   // ============================================

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
     

//       <main className="flex-1 overflow-auto">
//         {/* Header */}
//         <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
//           <div className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                 className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Finance Analytics</h1>
//                 <p className="text-sm text-gray-500 flex items-center gap-2">
//                   <span>Real-time financial overview and analytics</span>
//                   <Badge variant="outline" className="border-blue-500/30 text-blue-600">
//                     {dateRange.label}
//                   </Badge>
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               {/* Date Range Picker */}
//               <div className="relative">
//                 <Button
//                   onClick={() => setShowDatePicker(!showDatePicker)}
//                   variant="outline"
//                   className="border-gray-300 hover:bg-gray-50 text-gray-700"
//                 >
//                   <Calendar className="w-4 h-4 mr-2" />
//                   {dateRange.label}
//                   <ChevronDown className="w-4 h-4 ml-2" />
//                 </Button>

//                 {showDatePicker && (
//                   <>
//                     <div
//                       className="fixed inset-0 z-40"
//                       onClick={() => setShowDatePicker(false)}
//                     />
//                     <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4">
//                       <div className="space-y-3">
//                         <p className="text-sm font-medium text-gray-900">Quick Select</p>
//                         <div className="grid grid-cols-2 gap-2">
//                           {datePresets.map(preset => (
//                             <button
//                               key={preset.label}
//                               onClick={() => applyDatePreset(preset)}
//                               className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
//                             >
//                               {preset.label}
//                             </button>
//                           ))}
//                         </div>

//                         <div className="border-t border-gray-200 my-3" />

//                         <p className="text-sm font-medium text-gray-900">Custom Range</p>
//                         <div className="space-y-3">
//                           <div>
//                             <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
//                             <input
//                               type="date"
//                               value={customStartDate}
//                               onChange={(e) => setCustomStartDate(e.target.value)}
//                               className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
//                             />
//                           </div>
//                           <div>
//                             <label className="text-xs text-gray-500 mb-1 block">End Date</label>
//                             <input
//                               type="date"
//                               value={customEndDate}
//                               onChange={(e) => setCustomEndDate(e.target.value)}
//                               className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
//                             />
//                           </div>
//                           <Button
//                             onClick={applyCustomDateRange}
//                             className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                           >
//                             Apply Range
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Export Button */}
//               <Button
//                 onClick={exportToExcel}
//                 className="bg-green-600 hover:bg-green-700 text-white"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 Export Excel
//               </Button>

//               {/* Refresh Button */}
//               <Button
//                 onClick={handleRefresh}
//                 variant="outline"
//                 className="border-gray-300 hover:bg-gray-50 text-gray-700"
//                 disabled={refreshing}
//               >
//                 <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="p-6 max-w-7xl mx-auto space-y-6">
//           {/* THIS WEEK SECTION */}
//           <Card className="border border-gray-200 shadow-sm overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
//               <div className="flex items-center gap-2">
//                 <Clock className="w-5 h-5 text-blue-600" />
//                 <h2 className="text-lg font-semibold text-gray-900">This Week's Activity</h2>
//                 <Badge className="ml-2 bg-blue-100 text-blue-700 border-0">
//                   {format(thisWeekRange.start, 'dd MMM')} - {format(thisWeekRange.end, 'dd MMM yyyy')}
//                 </Badge>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {/* Jobs */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
//                         <Briefcase className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <h3 className="font-semibold text-gray-900">Jobs</h3>
//                     </div>
//                     <Badge className="bg-blue-100 text-blue-700 border-0">
//                       {thisWeekMetrics.jobs.count}
//                     </Badge>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Revenue</span>
//                       <span className="font-medium text-gray-900">AED {thisWeekMetrics.jobs.revenue.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Profit</span>
//                       <span className="font-medium text-green-600">AED {thisWeekMetrics.jobs.profit.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Services */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
//                         <Package className="w-4 h-4 text-emerald-600" />
//                       </div>
//                       <h3 className="font-semibold text-gray-900">Services</h3>
//                     </div>
//                     <Badge className="bg-emerald-100 text-emerald-700 border-0">
//                       {thisWeekMetrics.services.count}
//                     </Badge>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Revenue</span>
//                       <span className="font-medium text-gray-900">AED {thisWeekMetrics.services.revenue.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Profit</span>
//                       <span className="font-medium text-green-600">AED {thisWeekMetrics.services.profit.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Products */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
//                         <Layers className="w-4 h-4 text-amber-600" />
//                       </div>
//                       <h3 className="font-semibold text-gray-900">Products</h3>
//                     </div>
//                     <Badge className="bg-amber-100 text-amber-700 border-0">
//                       {thisWeekMetrics.products.count}
//                     </Badge>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Items Sold</span>
//                       <span className="font-medium text-gray-900">{thisWeekMetrics.products.itemsSold}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Revenue</span>
//                       <span className="font-medium text-gray-900">AED {thisWeekMetrics.products.revenue.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Profit</span>
//                       <span className="font-medium text-green-600">AED {thisWeekMetrics.products.profit.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Bookings */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
//                         <Users className="w-4 h-4 text-purple-600" />
//                       </div>
//                       <h3 className="font-semibold text-gray-900">Bookings</h3>
//                     </div>
//                     <Badge className="bg-purple-100 text-purple-700 border-0">
//                       {thisWeekMetrics.bookings.count}
//                     </Badge>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Completed</span>
//                       <span className="font-medium text-green-600">{thisWeekMetrics.bookings.completed}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Pending</span>
//                       <span className="font-medium text-amber-600">{thisWeekMetrics.bookings.pending}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* KPI Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0 shadow-lg">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <DollarSign className="w-8 h-8 text-blue-200" />
//                   <Badge className="bg-white/20 text-white border-0">
//                     {dateRange.label}
//                   </Badge>
//                 </div>
//                 <p className="text-blue-200 text-sm font-medium">Total Revenue</p>
//                 <p className="text-3xl font-bold text-white mt-2">
//                   AED {financialMetrics.overall.revenue.toLocaleString()}
//                 </p>
//                 <div className="flex items-center gap-2 mt-4 text-blue-200">
//                   <TrendingUp className="w-4 h-4" />
//                   <span className="text-sm">Profit: AED {financialMetrics.overall.profit.toLocaleString()}</span>
//                 </div>
//               </div>
//             </Card>

//             <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 border-0 shadow-lg">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <Briefcase className="w-8 h-8 text-emerald-200" />
//                   <Badge className="bg-white/20 text-white border-0">
//                     {financialMetrics.jobs.count} Jobs
//                   </Badge>
//                 </div>
//                 <p className="text-emerald-200 text-sm font-medium">Jobs Revenue</p>
//                 <p className="text-3xl font-bold text-white mt-2">
//                   AED {financialMetrics.jobs.budget.toLocaleString()}
//                 </p>
//                 <div className="flex items-center gap-2 mt-4 text-emerald-200">
//                   <span className="text-sm">Profit: AED {financialMetrics.jobs.profit.toLocaleString()}</span>
//                   <span className="text-xs px-2 py-1 bg-emerald-700 rounded-full">
//                     {financialMetrics.jobs.profitMargin.toFixed(1)}% margin
//                   </span>
//                 </div>
//               </div>
//             </Card>

//             <Card className="bg-gradient-to-br from-amber-600 to-amber-800 border-0 shadow-lg">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <Package className="w-8 h-8 text-amber-200" />
//                   <Badge className="bg-white/20 text-white border-0">
//                     {financialMetrics.services.count + financialMetrics.products.count} Items
//                   </Badge>
//                 </div>
//                 <p className="text-amber-200 text-sm font-medium">Services & Products</p>
//                 <p className="text-3xl font-bold text-white mt-2">
//                   AED {(financialMetrics.services.revenue + financialMetrics.products.revenue).toLocaleString()}
//                 </p>
//                 <div className="flex items-center gap-2 mt-4 text-amber-200">
//                   <span className="text-sm">Stock: {financialMetrics.products.totalStock} units</span>
//                   {financialMetrics.products.lowStock > 0 && (
//                     <span className="text-xs px-2 py-1 bg-amber-700 rounded-full">
//                       {financialMetrics.products.lowStock} low stock
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </Card>

//             <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0 shadow-lg">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <Users className="w-8 h-8 text-purple-200" />
//                   <Badge className="bg-white/20 text-white border-0">
//                     {financialMetrics.bookings.total} Bookings
//                   </Badge>
//                 </div>
//                 <p className="text-purple-200 text-sm font-medium">Conversion Rate</p>
//                 <p className="text-3xl font-bold text-white mt-2">
//                   {financialMetrics.bookings.conversionRate.toFixed(1)}%
//                 </p>
//                 <div className="flex items-center gap-2 mt-4 text-purple-200">
//                   <span className="text-sm">{financialMetrics.bookings.completed} completed</span>
//                   <span className="text-xs px-2 py-1 bg-purple-700 rounded-full">
//                     {financialMetrics.bookings.pending} pending
//                   </span>
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Charts Row 1 */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Revenue by Category - Pie Chart */}
//             <Card className="bg-white border-gray-200 p-6 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <PieChart className="w-5 h-5 text-blue-600" />
//                 Revenue by Category
//               </h3>
//               {revenueByCategory.length > 0 ? (
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <RePieChart>
// // Fix for the Pie Chart label
// <Pie
//   data={revenueByCategory}
//   cx="50%"
//   cy="50%"
//   innerRadius={60}
//   outerRadius={100}
//   paddingAngle={5}
//   dataKey="value"
//   label={({ name, percent }) => {
//     // ✅ Fix: Check if percent exists and is a number
//     const percentage = percent && typeof percent === 'number' ? percent * 100 : 0;
//     return `${name} ${percentage.toFixed(0)}%`;
//   }}
// >
//   {revenueByCategory.map((entry, index) => (
//     <Cell key={`cell-${index}`} fill={entry.color} />
//   ))}
// </Pie>
//                       <Tooltip
//                         contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb', color: '#111827' }}
//                         formatter={(value: any) => `AED ${value.toLocaleString()}`}
//                       />
//                       <Legend />
//                     </RePieChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <div className="h-80 flex items-center justify-center">
//                   <p className="text-gray-500">No revenue data for selected period</p>
//                 </div>
//               )}
//             </Card>

//             {/* Profit by Category - Bar Chart */}
//             <Card className="bg-white border-gray-200 p-6 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <BarChart3 className="w-5 h-5 text-blue-600" />
//                 Profit by Category
//               </h3>
//               {profitByCategory.some(item => item.profit !== 0) ? (
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={profitByCategory}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                       <XAxis dataKey="name" stroke="#6b7280" />
//                       <YAxis stroke="#6b7280" tickFormatter={(value) => `AED ${value/1000}k`} />
//                       <Tooltip
//                         contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb', color: '#111827' }}
//                         formatter={(value: any) => `AED ${value.toLocaleString()}`}
//                       />
//                       <Legend />
//                       <Bar dataKey="profit" fill="#10b981" name="Profit" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <div className="h-80 flex items-center justify-center">
//                   <p className="text-gray-500">No profit data for selected period</p>
//                 </div>
//               )}
//             </Card>
//           </div>

//           {/* Charts Row 2 */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Monthly Trend - Area Chart */}
//             <Card className="bg-white border-gray-200 p-6 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <TrendingUp className="w-5 h-5 text-blue-600" />
//                 Monthly Financial Trend
//               </h3>
//               {monthlyTrendData.length > 0 ? (
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={monthlyTrendData}>
//                       <defs>
//                         <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                         </linearGradient>
//                         <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
//                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                       <XAxis dataKey="month" stroke="#6b7280" />
//                       <YAxis stroke="#6b7280" tickFormatter={(value) => `AED ${value/1000}k`} />
//                       <Tooltip
//                         contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb', color: '#111827' }}
//                         formatter={(value: any) => `AED ${value.toLocaleString()}`}
//                       />
//                       <Legend />
//                       <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
//                       <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <div className="h-80 flex items-center justify-center">
//                   <p className="text-gray-500">No trend data for selected period</p>
//                 </div>
//               )}
//             </Card>

//             {/* Job Status Distribution */}
//             <Card className="bg-white border-gray-200 p-6 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <Briefcase className="w-5 h-5 text-blue-600" />
//                 Job Status Distribution
//               </h3>
//               {jobStatusData.length > 0 ? (
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <RePieChart>
//                      <Pie
//             data={revenueByCategory}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={100}
//             paddingAngle={5}
//             dataKey="value"
//             // ✅ FIXED: Default value for percent
//             label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
//           >
//             {revenueByCategory.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.color} />
//             ))}
//           </Pie>
//                       <Tooltip
//                         contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb', color: '#111827' }}
//                       />
//                     </RePieChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <div className="h-80 flex items-center justify-center">
//                   <p className="text-gray-500">No job data for selected period</p>
//                 </div>
//               )}
//             </Card>
//           </div>

//           {/* Tabs */}
//           <div className="border-b border-gray-200">
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setActiveTab('overview')}
//                 className={cn(
//                   "py-3 px-4 font-medium text-sm border-b-2 transition-colors",
//                   activeTab === 'overview'
//                     ? "border-blue-600 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 )}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setActiveTab('jobs')}
//                 className={cn(
//                   "py-3 px-4 font-medium text-sm border-b-2 transition-colors",
//                   activeTab === 'jobs'
//                     ? "border-blue-600 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 )}
//               >
//                 Jobs
//               </button>
//               <button
//                 onClick={() => setActiveTab('services')}
//                 className={cn(
//                   "py-3 px-4 font-medium text-sm border-b-2 transition-colors",
//                   activeTab === 'services'
//                     ? "border-blue-600 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 )}
//               >
//                 Services & Products
//               </button>
//               <button
//                 onClick={() => setActiveTab('bookings')}
//                 className={cn(
//                   "py-3 px-4 font-medium text-sm border-b-2 transition-colors",
//                   activeTab === 'bookings'
//                     ? "border-blue-600 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 )}
//               >
//                 Bookings
//               </button>
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="space-y-6">
//             {/* Overview Tab */}
//             {activeTab === 'overview' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Top Services */}
//                 <Card className="bg-white border-gray-200 p-6 shadow-sm">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Services</h3>
//                   {topServices.length > 0 ? (
//                     <div className="space-y-4">
//                       {topServices.map((service, idx) => (
//                         <div key={idx} className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                               <span className="text-sm font-bold text-blue-600">#{idx + 1}</span>
//                             </div>
//                             <div>
//                               <p className="text-gray-900 font-medium">{service.name}</p>
//                               <p className="text-xs text-gray-500">Profit: AED {service.profit.toLocaleString()}</p>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-gray-900 font-semibold">AED {service.revenue.toLocaleString()}</p>
//                             <p className="text-xs text-emerald-600">
//                               +{service.revenue ? ((service.profit / service.revenue) * 100).toFixed(1) : 0}% margin
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 text-center py-8">No service data available</p>
//                   )}
//                 </Card>

//                 {/* Recent Jobs */}
//                 <Card className="bg-white border-gray-200 p-6 shadow-sm">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
//                   {filteredJobs.slice(0, 5).length > 0 ? (
//                     <div className="space-y-4">
//                       {filteredJobs.slice(0, 5).map(job => (
//                         <div key={job.id} className="flex items-center justify-between">
//                           <div className="flex-1">
//                             <p className="text-gray-900 font-medium">{job.title}</p>
//                             <div className="flex items-center gap-2 mt-1">
//                               <span className="text-xs text-gray-500">{job.client}</span>
//                               <span className={`text-xs px-2 py-0.5 rounded-full ${
//                                 job.status === 'Completed' ? 'bg-green-100 text-green-700' :
//                                 job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
//                                 'bg-amber-100 text-amber-700'
//                               }`}>
//                                 {job.status}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-gray-900 font-semibold">AED {job.budget?.toLocaleString() || 0}</p>
//                             <p className="text-xs text-gray-500">Profit: AED {((job.budget || 0) - (job.actualCost || 0)).toLocaleString()}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 text-center py-8">No jobs in selected period</p>
//                   )}
//                 </Card>
//               </div>
//             )}

//             {/* Jobs Tab */}
//             {activeTab === 'jobs' && (
//               <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Cost</th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {filteredJobs.map(job => {
//                         const profit = (job.budget || 0) - (job.actualCost || 0);
//                         const margin = job.budget ? (profit / job.budget) * 100 : 0;
//                         return (
//                           <tr key={job.id} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <p className="text-gray-900 font-medium">{job.title}</p>
//                               <p className="text-xs text-gray-500">{job.location}</p>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-gray-700">{job.client}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className={`text-xs px-2 py-1 rounded-full ${
//                                 job.status === 'Completed' ? 'bg-green-100 text-green-700' :
//                                 job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
//                                 job.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
//                                 'bg-gray-100 text-gray-700'
//                               }`}>
//                                 {job.status}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
//                               AED {job.budget?.toLocaleString() || 0}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
//                               AED {job.actualCost?.toLocaleString() || 0}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-right">
//                               <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
//                                 AED {profit.toLocaleString()}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-right">
//                               <span className={margin >= 0 ? 'text-green-600' : 'text-red-600'}>
//                                 {margin.toFixed(1)}%
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//                               {job.createdAt ? format(new Date(job.createdAt), 'dd/MM/yyyy') : '-'}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </Card>
//             )}

//             {/* Services & Products Tab */}
//             {activeTab === 'services' && (
//               <div className="space-y-6">
//                 {/* Services */}
//                 <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
//                   <div className="px-6 py-4 border-b border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-900">Services</h3>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {filteredServices.map(service => {
//                           const profit = (service.price || 0) - (service.cost || 0);
//                           const margin = service.price ? (profit / service.price) * 100 : 0;
//                           return (
//                             <tr key={service.id} className="hover:bg-gray-50">
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <p className="text-gray-900 font-medium">{service.name}</p>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-gray-700">{service.categoryName || '-'}</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
//                                 AED {service.price?.toLocaleString() || 0}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
//                                 AED {service.cost?.toLocaleString() || 0}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right">
//                                 <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
//                                   AED {profit.toLocaleString()}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right">
//                                 <span className={margin >= 0 ? 'text-green-600' : 'text-red-600'}>
//                                   {margin.toFixed(1)}%
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
//                                 {service.stock || 0} {service.unit || ''}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </Card>

//                 {/* Products */}
//                 <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
//                   <div className="px-6 py-4 border-b border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-900">Products</h3>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {filteredProducts.map(product => {
//                           const profit = (product.price || 0) - (product.cost || 0);
//                           const margin = product.price ? (profit / product.price) * 100 : 0;
//                           const isLowStock = (product.stock || 0) <= (product.minStock || 0);
//                           return (
//                             <tr key={product.id} className="hover:bg-gray-50">
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <p className="text-gray-900 font-medium">{product.name}</p>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-gray-700">{product.categoryName || '-'}</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
//                                 AED {product.price?.toLocaleString() || 0}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
//                                 AED {product.cost?.toLocaleString() || 0}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right">
//                                 <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
//                                   AED {profit.toLocaleString()}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right">
//                                 <span className={margin >= 0 ? 'text-green-600' : 'text-red-600'}>
//                                   {margin.toFixed(1)}%
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right">
//                                 <span className={isLowStock ? 'text-red-600 font-semibold' : 'text-gray-500'}>
//                                   {product.stock || 0}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
//                                 {product.minStock || 0}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </Card>
//               </div>
//             )}

//             {/* Bookings Tab */}
//             {activeTab === 'bookings' && (
//               <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {filteredBookings.map(booking => (
//                         <tr key={booking.id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <p className="text-gray-900 font-medium">{booking.bookingId || booking.id}</p>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <p className="text-gray-900">{booking.name}</p>
//                             <p className="text-xs text-gray-500">{booking.email}</p>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-gray-700">{booking.phone}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-gray-700">{booking.service}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-gray-700">{booking.date}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-gray-700">{booking.time}</td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`text-xs px-2 py-1 rounded-full ${
//                               booking.status === 'completed' ? 'bg-green-100 text-green-700' :
//                               booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
//                               booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
//                               'bg-gray-100 text-gray-700'
//                             }`}>
//                               {booking.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-gray-700">{booking.area}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </Card>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// new code

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  FileText,
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Package,
  Award,
  Target,
  Wallet,
  Landmark,
  FileSpreadsheet,
  DownloadCloud,
  Zap,
  Activity,
  AlertTriangle,
  PiggyBank,
  Calculator,
  ChartPie,
  ChartBar,
  ChartLine,
  Receipt,
  HardHat,
  Building,
  Layers,
  Box} from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { format, startOfMonth, endOfMonth, subMonths, parseISO, isWithinInterval } from 'date-fns'

// ============= INTERFACES =============

interface Survey {
  id: string
  title: string
  description: string
  category: string
  status: string
  createdAt: any
  selectedClient?: {
    id: string
    name: string
    email: string
    phone: string
    company: string
    type: string
  }
  responsesCount: number
  sections: any[]
  surveyType: string
  generatedFrom: string
  leadId?: string
}

interface Quotation {
  id: string
  quoteNumber: string
  client: string
  clientId: string
  company: string
  email: string
  phone: string
  location: string
  date: string
  validUntil: string
  dueDate: string
  status: string
  subtotal: number
  discount: number
  discountAmount: number
  discountType: string
  taxAmount: number
  taxRate: number
  total: number
  services: Array<{
    id: string
    name: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  products?: Array<{
    id: string
    name: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  currency: string
  createdBy: string
  createdAt: any
  updatedAt: any
  template: string
  terms: string
  notes: string
  paymentMethods: string[]
  bankDetails: any
}

interface Job {
  id: string
  title: string
  description: string
  client: string
  clientId: string
  location: string
  status: string
  priority: string
  riskLevel: string
  scheduledDate: string
  scheduledTime: string
  completedAt: any
  estimatedDuration: string
  actualDuration?: string
  budget: number
  actualCost: number
  teamRequired: number
  assignedEmployees: any[]
  requiredSkills: string[]
  equipment: any[]
  milestones: any[]
  tasks: any[]
  executionLogs: any[]
  permits: any[]
  tags: string[]
  specialInstructions: string
  slaDeadline: string
  recurring: boolean
  reminderEnabled: boolean
  overtimeRequired: boolean
  overtimeHours: number
  overtimeApproved: boolean
  createdAt: any
  updatedAt: any
}

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  role: string
  status: string
  rating: number
  salary: number
  salaryStructure: string
  bankAccount: string
  bankName: string
  joinDate: string
  dateOfBirth: string
  nationality: string
  emiratesIdNumber: string
  passportNumber: string
  visaNumber: string
  visaExpiryDate: string
  emergencyContact: string
  emergencyPhone: string
  emergencyRelation: string
  supervisor: string
  assignedRoles: string[]
  team: any[]
  documents: any[]
  burnoutRisk: string
  createdAt: any
  lastUpdated: any
}

interface Booking {
  id: string
  bookingId: string
  name: string
  email: string
  phone: string
  area: string
  service: string
  date: string
  time: string
  status: string
  frequency: string
  propertyType: string
  message: string
  createdAt: any
  updatedAt: any
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  isActive: boolean
  itemCount: number
  createdAt: any
  updatedAt: any
}

interface Service {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  categoryName: string
  price: number
  cost: number
  profitMargin: number
  sku: string
  unit: string
  type: string
  status: string
  isActive: boolean
  imageUrl: string
  createdAt: any
  updatedAt: any
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  categoryName: string
  price: number
  cost: number
  profitMargin: number
  sku: string
  unit: string
  type: string
  status: string
  isActive: boolean
  stock: number
  minStock: number
  imageUrl: string
  createdAt: any
  updatedAt: any
}

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  location: string
  joinDate: string
  totalSpent: number
  projects: number
  lastService: string
  status: string
  tier: string
  notes: string
  contracts: any[]
  createdAt: any
  updatedAt: any
}

// ============= FINANCIAL METRICS INTERFACE =============

interface FinancialMetrics {
  // Revenue metrics
  totalRevenue: number
  monthlyRevenue: number
  quarterlyRevenue: number
  yearlyRevenue: number
  averageOrderValue: number
  revenueGrowth: number
  projectedRevenue: number
  
  // Service Revenue
  serviceRevenue: number
  serviceCost: number
  serviceProfit: number
  serviceMargin: number
  topServices: Array<{name: string, revenue: number, profit: number, quantity: number, margin: number}>
  servicesByCategory: Array<{category: string, revenue: number, count: number}>
  
  // Product Revenue
  productRevenue: number
  productCost: number
  productProfit: number
  productMargin: number
  inventoryValue: number
  lowStockItems: number
  topProducts: Array<{name: string, revenue: number, profit: number, quantity: number, margin: number, stock: number}>
  productsByCategory: Array<{category: string, revenue: number, count: number}>
  
  // Quotation metrics
  totalQuotations: number
  approvedQuotations: number
  approvedValue: number
  pendingQuotations: number
  rejectedQuotations: number
  draftQuotations: number
  quotationValue: number
  conversionRate: number
  
  // Job metrics
  totalJobs: number
  completedJobs: number
  inProgressJobs: number
  pendingJobs: number
  cancelledJobs: number
  jobRevenue: number
  jobCost: number
  jobProfit: number
  jobMargin: number
  
  // Client metrics
  totalClients: number
  activeClients: number
  newClients: number
  clientLTV: number
  repeatRate: number
  topClients: Array<{name: string, spent: number, projects: number, tier: string}>
  
  // Employee metrics
  totalEmployees: number
  activeEmployees: number
  totalPayroll: number
  averageSalary: number
  employeeCost: number
  departmentCosts: Array<{department: string, cost: number, count: number}>
  
  // Survey metrics
  totalSurveys: number
  completedSurveys: number
  surveyResponses: number
  
  // Booking metrics
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  cancelledBookings: number
  bookingValue: number
  
  // Category metrics
  totalCategories: number
  activeCategories: number
  categoriesWithItems: Array<{name: string, count: number}>
  
  // Tax metrics
  totalTax: number
  averageTaxRate: number
  
  // Discount metrics
  totalDiscounts: number
  averageDiscount: number
  
  // Profit & Loss
  grossProfit: number
  netProfit: number
  operatingExpenses: number
  profitMargin: number
  roi: number
}

// ============= DATE RANGE TYPE =============

type DateRangeType = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom' | 'all'

// ============= MAIN COMPONENT =============

export default function FinanceReportPage() {
  // ============= STATE MANAGEMENT =============
  
  // Data states
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [clients, setClients] = useState<Client[]>([])
  
  // UI states
  const [dateRange, setDateRange] = useState<DateRangeType>('month')
  const [customStartDate, setCustomStartDate] = useState<string>(
    format(subMonths(new Date(), 1), 'yyyy-MM-dd')
  )
  const [customEndDate, setCustomEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarView, setCalendarView] = useState<'year' | 'month'>('month')
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'profit-loss' | 'quotations' | 'jobs' | 'clients' | 'employees' | 'services' | 'products'>('overview')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'name'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')
  const [showExportModal, setShowExportModal] = useState(false)

  // ============= DATA FETCHING =============

  useEffect(() => {
    fetchSurveys()
    fetchQuotations()
    fetchJobs()
    fetchEmployees()
    fetchBookings()
    fetchCategories()
    fetchServices()
    fetchProducts()
    fetchClients()
  }, [])

  const fetchSurveys = async () => {
    try {
      const q = query(collection(db, 'surveys'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Survey[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          title: docData.title || 'Untitled Survey',
          description: docData.description || '',
          category: docData.category || 'General',
          status: docData.status || 'draft',
          createdAt: docData.createdAt,
          selectedClient: docData.selectedClient,
          responsesCount: docData.responsesCount || 0,
          sections: docData.sections || [],
          surveyType: docData.surveyType || '',
          generatedFrom: docData.generatedFrom || 'manual',
          leadId: docData.leadId
        })
      })
      
      setSurveys(data)
    } catch (error) {
      console.error('Error fetching surveys:', error)
    }
  }

  const fetchQuotations = async () => {
    try {
      const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Quotation[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          quoteNumber: docData.quoteNumber || `QT-${doc.id.slice(0, 8)}`,
          client: docData.client || 'Unknown Client',
          clientId: docData.clientId || '',
          company: docData.company || '',
          email: docData.email || '',
          phone: docData.phone || '',
          location: docData.location || '',
          date: docData.date || format(new Date(), 'yyyy-MM-dd'),
          validUntil: docData.validUntil || '',
          dueDate: docData.dueDate || '',
          status: docData.status || 'Draft',
          subtotal: docData.subtotal || 0,
          discount: docData.discount || 0,
          discountAmount: docData.discountAmount || 0,
          discountType: docData.discountType || 'percentage',
          taxAmount: docData.taxAmount || 0,
          taxRate: docData.taxRate || 0,
          total: docData.total || 0,
          services: docData.services || [],
          products: docData.products || [],
          currency: docData.currency || 'AED',
          createdBy: docData.createdBy || 'system',
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt,
          template: docData.template || 'standard',
          terms: docData.terms || '',
          notes: docData.notes || '',
          paymentMethods: docData.paymentMethods || [],
          bankDetails: docData.bankDetails || {}
        })
      })
      
      setQuotations(data)
    } catch (error) {
      console.error('Error fetching quotations:', error)
    }
  }

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Job[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          title: docData.title || 'Untitled Job',
          description: docData.description || '',
          client: docData.client || 'Unknown Client',
          clientId: docData.clientId || '',
          location: docData.location || '',
          status: docData.status || 'Pending',
          priority: docData.priority || 'Medium',
          riskLevel: docData.riskLevel || 'Low',
          scheduledDate: docData.scheduledDate || '',
          scheduledTime: docData.scheduledTime || '',
          completedAt: docData.completedAt,
          estimatedDuration: docData.estimatedDuration || '0',
          actualDuration: docData.actualDuration,
          budget: docData.budget || 0,
          actualCost: docData.actualCost || 0,
          teamRequired: docData.teamRequired || 1,
          assignedEmployees: docData.assignedEmployees || [],
          requiredSkills: docData.requiredSkills || [],
          equipment: docData.equipment || [],
          milestones: docData.milestones || [],
          tasks: docData.tasks || [],
          executionLogs: docData.executionLogs || [],
          permits: docData.permits || [],
          tags: docData.tags || [],
          specialInstructions: docData.specialInstructions || '',
          slaDeadline: docData.slaDeadline || '',
          recurring: docData.recurring || false,
          reminderEnabled: docData.reminderEnabled || false,
          overtimeRequired: docData.overtimeRequired || false,
          overtimeHours: docData.overtimeHours || 0,
          overtimeApproved: docData.overtimeApproved || false,
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchEmployees = async () => {
    try {
      const q = query(collection(db, 'employees'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Employee[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unknown',
          email: docData.email || '',
          phone: docData.phone || '',
          position: docData.position || '',
          department: docData.department || '',
          role: docData.role || '',
          status: docData.status || 'Active',
          rating: docData.rating || 0,
          salary: docData.salary || 0,
          salaryStructure: docData.salaryStructure || 'Monthly',
          bankAccount: docData.bankAccount || '',
          bankName: docData.bankName || '',
          joinDate: docData.joinDate || '',
          dateOfBirth: docData.dateOfBirth || '',
          nationality: docData.nationality || '',
          emiratesIdNumber: docData.emiratesIdNumber || '',
          passportNumber: docData.passportNumber || '',
          visaNumber: docData.visaNumber || '',
          visaExpiryDate: docData.visaExpiryDate || '',
          emergencyContact: docData.emergencyContact || '',
          emergencyPhone: docData.emergencyPhone || '',
          emergencyRelation: docData.emergencyRelation || '',
          supervisor: docData.supervisor || '',
          assignedRoles: docData.assignedRoles || [],
          team: docData.team || [],
          documents: docData.documents || [],
          burnoutRisk: docData.burnoutRisk || 'Low',
          createdAt: docData.createdAt,
          lastUpdated: docData.lastUpdated
        })
      })
      
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Booking[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          bookingId: docData.bookingId || `BK-${doc.id.slice(0, 8)}`,
          name: docData.name || '',
          email: docData.email || '',
          phone: docData.phone || '',
          area: docData.area || '',
          service: docData.service || '',
          date: docData.date || '',
          time: docData.time || '',
          status: docData.status || 'pending',
          frequency: docData.frequency || 'once',
          propertyType: docData.propertyType || '',
          message: docData.message || '',
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Category[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unnamed Category',
          slug: docData.slug || '',
          description: docData.description || '',
          color: docData.color || '#3B82F6',
          isActive: docData.isActive || false,
          itemCount: docData.itemCount || 0,
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Service[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unnamed Service',
          slug: docData.slug || '',
          description: docData.description || '',
          categoryId: docData.categoryId || '',
          categoryName: docData.categoryName || 'Uncategorized',
          price: docData.price || 0,
          cost: docData.cost || 0,
          profitMargin: docData.profitMargin || 0,
          sku: docData.sku || '',
          unit: docData.unit || 'Hour',
          type: docData.type || 'SERVICE',
          status: docData.status || 'ACTIVE',
          isActive: docData.isActive || false,
          imageUrl: docData.imageUrl || '',
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Product[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unnamed Product',
          slug: docData.slug || '',
          description: docData.description || '',
          categoryId: docData.categoryId || '',
          categoryName: docData.categoryName || 'Uncategorized',
          price: docData.price || 0,
          cost: docData.cost || 0,
          profitMargin: docData.profitMargin || 0,
          sku: docData.sku || '',
          unit: docData.unit || 'Unit',
          type: docData.type || 'PRODUCT',
          status: docData.status || 'ACTIVE',
          isActive: docData.isActive || false,
          stock: docData.stock || 0,
          minStock: docData.minStock || 0,
          imageUrl: docData.imageUrl || '',
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchClients = async () => {
    try {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const data: Client[] = []
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        data.push({
          id: doc.id,
          name: docData.name || 'Unknown',
          company: docData.company || '',
          email: docData.email || '',
          phone: docData.phone || '',
          location: docData.location || '',
          joinDate: docData.joinDate || '',
          totalSpent: docData.totalSpent || 0,
          projects: docData.projects || 0,
          lastService: docData.lastService || 'No service yet',
          status: docData.status || 'Active',
          tier: docData.tier || 'Bronze',
          notes: docData.notes || '',
          contracts: docData.contracts || [],
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt
        })
      })
      
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  // ============= DATE FILTERING =============

  const getDateRange = useMemo(() => {
    const now = new Date()
    
    switch (dateRange) {
      case 'today':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
      case 'week':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
      case 'quarter':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
      case 'year':
        return {
          start: new Date(selectedYear, 0, 1),
          end: new Date(selectedYear, 11, 31)
        }
      case 'custom':
        return {
          start: parseISO(customStartDate),
          end: parseISO(customEndDate)
        }
      case 'all':
      default:
        return {
          start: new Date(2000, 0, 1),
          end: now
        }
    }
  }, [dateRange, selectedYear, customStartDate, customEndDate])

  const isInDateRange = (date: any): boolean => {
    if (!date) return false
    
    let dateObj: Date
    if (date.toDate) {
      dateObj = date.toDate()
    } else if (date.seconds) {
      dateObj = new Date(date.seconds * 1000)
    } else if (typeof date === 'string') {
      dateObj = parseISO(date)
    } else {
      dateObj = new Date(date)
    }
    
    const range = getDateRange
    return isWithinInterval(dateObj, { start: range.start, end: range.end })
  }

  // ============= FINANCIAL METRICS CALCULATION =============

  const metrics = useMemo((): FinancialMetrics => {
    // Filter data by date range
    const filteredQuotations = quotations.filter(q => isInDateRange(q.createdAt))
    const filteredJobs = jobs.filter(j => isInDateRange(j.createdAt) || isInDateRange(j.completedAt))
    const filteredBookings = bookings.filter(b => isInDateRange(b.createdAt))
    const filteredSurveys = surveys.filter(s => isInDateRange(s.createdAt))
    const filteredClients = clients.filter(c => {
      if (c.createdAt) {
        return isInDateRange(c.createdAt)
      }
      if (c.joinDate) {
        return isInDateRange(c.joinDate)
      }
      return false
    })

    // ===== SERVICE REVENUE CALCULATIONS =====
    let serviceRevenue = 0
    let serviceCost = 0
    const serviceRevenueMap = new Map<string, { revenue: number, cost: number, quantity: number }>()
    const serviceCategoryMap = new Map<string, { revenue: number, count: number }>()

    filteredQuotations
      .filter(q => q.status === 'Approved' || q.status === 'Completed')
      .forEach(q => {
        q.services?.forEach(s => {
          const service = services.find(svc => svc.name === s.name)
          const revenue = s.total || 0
          const cost = (service?.cost || 0) * (s.quantity || 1)
          
          serviceRevenue += revenue
          serviceCost += cost
          
          // Service breakdown
          const current = serviceRevenueMap.get(s.name) || { revenue: 0, cost: 0, quantity: 0 }
          serviceRevenueMap.set(s.name, {
            revenue: current.revenue + revenue,
            cost: current.cost + cost,
            quantity: current.quantity + (s.quantity || 1)
          })
          
          // Category breakdown
          if (service?.categoryName) {
            const catCurrent = serviceCategoryMap.get(service.categoryName) || { revenue: 0, count: 0 }
            serviceCategoryMap.set(service.categoryName, {
              revenue: catCurrent.revenue + revenue,
              count: catCurrent.count + 1
            })
          }
        })
      })

  const serviceProfit = serviceRevenue - serviceCost
  const serviceMargin = serviceRevenue > 0 ? (serviceProfit / serviceRevenue) * 100 : 0

  // Top Services
  const topServices = Array.from(serviceRevenueMap.entries())
    .map(([name, data]) => ({
      name,
      revenue: data.revenue,
      profit: data.revenue - data.cost,
      quantity: data.quantity,
      margin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  // Services by Category
  const servicesByCategory = Array.from(serviceCategoryMap.entries())
    .map(([category, data]) => ({
      category,
      revenue: data.revenue,
      count: data.count
    }))
    .sort((a, b) => b.revenue - a.revenue)

  // ===== PRODUCT REVENUE CALCULATIONS =====
  let productRevenue = 0
  let productCost = 0
  const productRevenueMap = new Map<string, { revenue: number, cost: number, quantity: number, stock: number }>()
  const productCategoryMap = new Map<string, { revenue: number, count: number }>()

  filteredQuotations
    .filter(q => q.status === 'Approved' || q.status === 'Completed')
    .forEach(q => {
      q.products?.forEach(p => {
        const product = products.find(pr => pr.name === p.name)
        const revenue = p.total || 0
        const cost = (product?.cost || 0) * (p.quantity || 1)
        
        productRevenue += revenue
        productCost += cost
        
        // Product breakdown
        const current = productRevenueMap.get(p.name) || { 
          revenue: 0, 
          cost: 0, 
          quantity: 0,
          stock: product?.stock || 0 
        }
        productRevenueMap.set(p.name, {
          revenue: current.revenue + revenue,
          cost: current.cost + cost,
          quantity: current.quantity + (p.quantity || 1),
          stock: product?.stock || 0
        })
        
        // Category breakdown
        if (product?.categoryName) {
          const catCurrent = productCategoryMap.get(product.categoryName) || { revenue: 0, count: 0 }
          productCategoryMap.set(product.categoryName, {
            revenue: catCurrent.revenue + revenue,
            count: catCurrent.count + 1
          })
        }
      })
    })

  const productProfit = productRevenue - productCost
  const productMargin = productRevenue > 0 ? (productProfit / productRevenue) * 100 : 0

  // Top Products
  const topProducts = Array.from(productRevenueMap.entries())
    .map(([name, data]) => ({
      name,
      revenue: data.revenue,
      profit: data.revenue - data.cost,
      quantity: data.quantity,
      margin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
      stock: data.stock
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  // Products by Category
  const productsByCategory = Array.from(productCategoryMap.entries())
    .map(([category, data]) => ({
      category,
      revenue: data.revenue,
      count: data.count
    }))
    .sort((a, b) => b.revenue - a.revenue)

  // Inventory Value
  const inventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
  const lowStockItems = products.filter(p => (p.stock || 0) <= (p.minStock || 0)).length

  // ===== JOB REVENUE CALCULATIONS =====
  const jobRevenue = filteredJobs
    .filter(j => j.status === 'Completed')
    .reduce((sum, j) => sum + (j.budget || 0), 0)
  
  const jobCost = filteredJobs
    .filter(j => j.status === 'Completed')
    .reduce((sum, j) => sum + (j.actualCost || 0), 0)
  
  const jobProfit = jobRevenue - jobCost
  const jobMargin = jobRevenue > 0 ? (jobProfit / jobRevenue) * 100 : 0

  // ===== BOOKING VALUE =====
  const bookingValue = filteredBookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .length * 1000 // Average booking value - you can enhance this

  // ===== QUOTATION METRICS =====
  const totalQuotations = filteredQuotations.length
  const approvedQuotations = filteredQuotations.filter(q => q.status === 'Approved').length
  const approvedValue = filteredQuotations
    .filter(q => q.status === 'Approved')
    .reduce((sum, q) => sum + (q.total || 0), 0)
  const pendingQuotations = filteredQuotations.filter(q => q.status === 'Pending' || q.status === 'Draft').length
  const rejectedQuotations = filteredQuotations.filter(q => q.status === 'Rejected').length
  const draftQuotations = filteredQuotations.filter(q => q.status === 'Draft').length
  const quotationValue = filteredQuotations.reduce((sum, q) => sum + (q.total || 0), 0)
  const conversionRate = totalQuotations > 0 ? (approvedQuotations / totalQuotations) * 100 : 0

  // ===== JOB METRICS =====
  const totalJobs = filteredJobs.length
  const completedJobs = filteredJobs.filter(j => j.status === 'Completed').length
  const inProgressJobs = filteredJobs.filter(j => j.status === 'In Progress' || j.status === 'Active').length
  const pendingJobs = filteredJobs.filter(j => j.status === 'Pending' || j.status === 'Scheduled').length
  const cancelledJobs = filteredJobs.filter(j => j.status === 'Cancelled').length

  // ===== CLIENT METRICS =====
  const totalClients = filteredClients.length
  const activeClients = filteredClients.filter(c => c.status === 'Active').length
  const newClients = filteredClients.length
  const clientLTV = activeClients > 0 ? approvedValue / activeClients : 0
  const repeatRate = totalClients > 0 ? 
    (clients.filter(c => c.projects > 1).length / totalClients) * 100 : 0

  // Top Clients
  const topClients = clients
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10)
    .map(c => ({ 
      name: c.name, 
      spent: c.totalSpent, 
      projects: c.projects,
      tier: c.tier 
    }))

  // ===== EMPLOYEE METRICS =====
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'Active').length
  const totalPayroll = employees
    .filter(e => e.status === 'Active')
    .reduce((sum, e) => sum + (e.salary || 0), 0)
  const averageSalary = activeEmployees > 0 ? totalPayroll / activeEmployees : 0
  const employeeCost = totalPayroll

  // Department costs
  const departmentMap = new Map<string, { cost: number, count: number }>()
  employees.forEach(e => {
    if (e.status === 'Active') {
      const current = departmentMap.get(e.department) || { cost: 0, count: 0 }
      departmentMap.set(e.department, {
        cost: current.cost + (e.salary || 0),
        count: current.count + 1
      })
    }
  })
  const departmentCosts = Array.from(departmentMap.entries())
    .map(([department, data]) => ({ 
      department: department || 'Unassigned', 
      cost: data.cost,
      count: data.count
    }))
    .sort((a, b) => b.cost - a.cost)

  // ===== SURVEY METRICS =====
  const totalSurveys = filteredSurveys.length
  const completedSurveys = filteredSurveys.filter(s => s.status === 'completed' || s.status === 'published').length
  const surveyResponses = filteredSurveys.reduce((sum, s) => sum + (s.responsesCount || 0), 0)

  // ===== BOOKING METRICS =====
  const totalBookings = filteredBookings.length
  const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length
  const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed' || b.status === 'accepted').length
  const completedBookings = filteredBookings.filter(b => b.status === 'completed').length
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length

  // ===== CATEGORY METRICS =====
  const totalCategories = categories.length
  const activeCategories = categories.filter(c => c.isActive).length
  const categoriesWithItems = categories
    .filter(c => c.itemCount > 0)
    .map(c => ({ name: c.name, count: c.itemCount }))
    .sort((a, b) => b.count - a.count)

  // ===== TAX METRICS =====
  const totalTax = filteredQuotations
    .filter(q => q.status === 'Approved')
    .reduce((sum, q) => sum + (q.taxAmount || 0), 0)
  const averageTaxRate = filteredQuotations.length > 0 ? 
    filteredQuotations.reduce((sum, q) => sum + (q.taxRate || 0), 0) / filteredQuotations.length : 0

  // ===== DISCOUNT METRICS =====
  const totalDiscounts = filteredQuotations
    .filter(q => q.status === 'Approved')
    .reduce((sum, q) => sum + (q.discountAmount || 0), 0)
  const averageDiscount = filteredQuotations.length > 0 ? 
    filteredQuotations.reduce((sum, q) => sum + (q.discount || 0), 0) / filteredQuotations.length : 0

  // ===== TOTAL REVENUE =====
  const totalRevenue = serviceRevenue + productRevenue + jobRevenue + bookingValue
  
  // ===== PROFIT & LOSS =====
  const grossProfit = serviceProfit + productProfit + jobProfit
  const operatingExpenses = totalPayroll
  const netProfit = grossProfit - operatingExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  const roi = operatingExpenses > 0 ? (netProfit / operatingExpenses) * 100 : 0

  // ===== MONTHLY/QUARTERLY/YEARLY =====
  const monthlyRevenue = totalRevenue
  const quarterlyRevenue = totalRevenue
  const yearlyRevenue = totalRevenue
  const averageOrderValue = approvedQuotations > 0 ? approvedValue / approvedQuotations : 0

  return {
    // Revenue
    totalRevenue,
    monthlyRevenue,
    quarterlyRevenue,
    yearlyRevenue,
    averageOrderValue,
    revenueGrowth: 0,
    projectedRevenue: totalRevenue * 1.1,
    
    // Service
    serviceRevenue,
    serviceCost,
    serviceProfit,
    serviceMargin,
    topServices,
    servicesByCategory,
    
    // Product
    productRevenue,
    productCost,
    productProfit,
    productMargin,
    inventoryValue,
    lowStockItems,
    topProducts,
    productsByCategory,
    
    // Quotations
    totalQuotations,
    approvedQuotations,
    approvedValue,
    pendingQuotations,
    rejectedQuotations,
    draftQuotations,
    quotationValue,
    conversionRate,
    
    // Jobs
    totalJobs,
    completedJobs,
    inProgressJobs,
    pendingJobs,
    cancelledJobs,
    jobRevenue,
    jobCost,
    jobProfit,
    jobMargin,
    
    // Clients
    totalClients,
    activeClients,
    newClients,
    clientLTV,
    repeatRate,
    topClients,
    
    // Employees
    totalEmployees,
    activeEmployees,
    totalPayroll,
    averageSalary,
    employeeCost,
    departmentCosts,
    
    // Surveys
    totalSurveys,
    completedSurveys,
    surveyResponses,
    
    // Bookings
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    bookingValue,
    
    // Categories
    totalCategories,
    activeCategories,
    categoriesWithItems,
    
    // Tax
    totalTax,
    averageTaxRate,
    
    // Discount
    totalDiscounts,
    averageDiscount,
    
    // P&L
    grossProfit,
    netProfit,
    operatingExpenses,
    profitMargin,
    roi
  }
}, [quotations, jobs, employees, bookings, surveys, categories, services, products, clients, dateRange, selectedYear, customStartDate, customEndDate])

  // ============= CHART DATA PREPARATION =============

  const monthlyRevenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const data = Array(12).fill(0)
    
    quotations
      .filter(q => q.status === 'Approved' || q.status === 'Completed')
      .forEach(q => {
        if (q.createdAt) {
          let date: Date
          if (q.createdAt.toDate) {
            date = q.createdAt.toDate()
          } else if (q.createdAt.seconds) {
            date = new Date(q.createdAt.seconds * 1000)
          } else {
            date = new Date(q.createdAt)
          }
          
          if (date.getFullYear() === selectedYear) {
            data[date.getMonth()] += q.total
          }
        }
      })
    
    return { labels: months, values: data }
  }, [quotations, selectedYear])

  const revenueBreakdownData = useMemo(() => {
    return {
      labels: ['Services', 'Products', 'Jobs', 'Bookings'],
      values: [
        metrics.serviceRevenue,
        metrics.productRevenue,
        metrics.jobRevenue,
        metrics.bookingValue
      ],
      colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']
    }
  }, [metrics])

  const profitBreakdownData = useMemo(() => {
    return {
      labels: ['Service Profit', 'Product Profit', 'Job Profit'],
      values: [
        metrics.serviceProfit,
        metrics.productProfit,
        metrics.jobProfit
      ],
      colors: ['#10B981', '#F59E0B', '#8B5CF6']
    }
  }, [metrics])

  // ============= RENDER HELPERS =============

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-AE').format(value)
  }

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend = 0, 
    trendLabel = '',
    color = 'blue',
    subValue = '',
    tooltip = ''
  }: { 
    title: string
    value: string | number
    icon: any
    trend?: number
    trendLabel?: string
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'red' | 'amber' | 'emerald'
    subValue?: string
    tooltip?: string
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 border-2 ${colorClasses[color]} bg-white relative group`}
        title={tooltip}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          {trend !== 0 && (
            <div className={`flex items-center gap-1 text-sm font-bold ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-3xl font-black text-slate-900">{value}</p>
          {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
          {trendLabel && <p className="text-xs text-slate-500 mt-1">{trendLabel}</p>}
        </div>
      </motion.div>
    )
  }

  const TableCard = ({ 
    title, 
    icon: Icon,
    children,
    action,
    className = '' 
  }: { 
    title: string
    icon: any
    children: React.ReactNode
    action?: React.ReactNode
    className?: string
  }) => (
    <div className={`bg-white rounded-2xl border-2 border-slate-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 bg-slate-50 border-b-2 border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )

  // ============= MAIN RENDER =============

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
                Financial <span className="text-[#039ED9]">Report</span>
              </h1>
              <p className="text-slate-600 text-lg">
                Complete financial overview - Revenue: {formatCurrency(metrics.totalRevenue)} | Profit: {formatCurrency(metrics.netProfit)} | Margin: {formatPercentage(metrics.profitMargin)}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-primary transition-colors font-bold text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  {dateRange === 'today' && 'Today'}
                  {dateRange === 'week' && 'This Week'}
                  {dateRange === 'month' && 'This Month'}
                  {dateRange === 'quarter' && 'This Quarter'}
                  {dateRange === 'year' && `Year ${selectedYear}`}
                  {dateRange === 'custom' && `${format(parseISO(customStartDate), 'MMM d')} - ${format(parseISO(customEndDate), 'MMM d')}`}
                  {dateRange === 'all' && 'All Time'}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showCalendar && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-slate-200 rounded-2xl shadow-xl z-50 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCalendarView('month')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            calendarView === 'month' ? 'bg-primary text-white' : 'bg-slate-100'
                          }`}
                        >
                          Month
                        </button>
                        <button
                          onClick={() => setCalendarView('year')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            calendarView === 'year' ? 'bg-primary text-white' : 'bg-slate-100'
                          }`}
                        >
                          Year
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setDateRange('today')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('week')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        This Week
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('month')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        This Month
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('quarter')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        This Quarter
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('year')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        This Year
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('all')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        All Time
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('custom')
                          setShowCalendar(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        Custom Range
                      </button>
                    </div>

                    {dateRange === 'custom' && (
                      <div className="mt-4 pt-4 border-t-2 border-slate-200 space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-4 py-2.5  text-white rounded-xl bg-[#039ED9] transition-colors font-bold text-sm"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  fetchSurveys()
                  fetchQuotations()
                  fetchJobs()
                  fetchEmployees()
                  fetchBookings()
                  fetchCategories()
                  fetchServices()
                  fetchProducts()
                  fetchClients()
                }}
                className="p-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-primary transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: PieChart },
              { id: 'revenue', label: 'Revenue', icon: TrendingUp },
              { id: 'profit-loss', label: 'Profit & Loss', icon: Calculator },
              { id: 'quotations', label: 'Quotations', icon: FileText },
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'employees', label: 'Employees', icon: HardHat },
              { id: 'services', label: 'Services', icon: Zap },
              { id: 'products', label: 'Products', icon: Package }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#039ED9] text-white'
                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-primary'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl hover:border-primary transition-colors text-sm font-bold"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showFilters && (
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                >
                  <option value="date">Sort by Date</option>
                  <option value="value">Sort by Value</option>
                  <option value="name">Sort by Name</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border-2 border-slate-200 rounded-lg hover:border-primary transition-colors"
                >
                  {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(metrics.totalRevenue)}
                icon={DollarSign}
                trend={12}
                trendLabel="vs last month"
                color="green"
                tooltip="Total revenue from all sources: Services, Products, Jobs, Bookings"
              />
              <MetricCard
                title="Net Profit"
                value={formatCurrency(metrics.netProfit)}
                icon={PiggyBank}
                subValue={`Margin: ${formatPercentage(metrics.profitMargin)}`}
                color="blue"
                tooltip="Revenue minus costs and expenses"
              />
              <MetricCard
                title="Gross Profit"
                value={formatCurrency(metrics.grossProfit)}
                icon={TrendingUp}
                subValue={`ROI: ${formatPercentage(metrics.roi)}`}
                color="purple"
                tooltip="Profit before operating expenses"
              />
              <MetricCard
                title="Operating Expenses"
                value={formatCurrency(metrics.operatingExpenses)}
                icon={Wallet}
                subValue={`Payroll: ${formatCurrency(metrics.totalPayroll)}`}
                color="orange"
                tooltip="Total operating costs including payroll"
              />
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Service Revenue"
                value={formatCurrency(metrics.serviceRevenue)}
                icon={Zap}
                subValue={`Profit: ${formatCurrency(metrics.serviceProfit)} (${formatPercentage(metrics.serviceMargin)})`}
                color="blue"
              />
              <MetricCard
                title="Product Revenue"
                value={formatCurrency(metrics.productRevenue)}
                icon={Package}
                subValue={`Profit: ${formatCurrency(metrics.productProfit)} (${formatPercentage(metrics.productMargin)})`}
                color="green"
              />
              <MetricCard
                title="Job Revenue"
                value={formatCurrency(metrics.jobRevenue)}
                icon={Briefcase}
                subValue={`Profit: ${formatCurrency(metrics.jobProfit)} (${formatPercentage(metrics.jobMargin)})`}
                color="purple"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Breakdown Chart */}
              <TableCard title="Revenue Breakdown" icon={ChartPie}>
                <div className="space-y-4">
                  {revenueBreakdownData.labels.map((label, i) => {
                    const total = revenueBreakdownData.values.reduce((a, b) => a + b, 0)
                    const percentage = total > 0 ? (revenueBreakdownData.values[i] / total) * 100 : 0
                    
                    return (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-slate-900">{label}</span>
                          <span className="font-bold" style={{ color: revenueBreakdownData.colors[i] }}>
                            {formatCurrency(revenueBreakdownData.values[i])}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: revenueBreakdownData.colors[i]
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 text-right">{percentage.toFixed(1)}%</p>
                      </div>
                    )
                  })}
                </div>
              </TableCard>

              {/* Profit Breakdown Chart */}
              <TableCard title="Profit Breakdown" icon={ChartBar}>
                <div className="space-y-4">
                  {profitBreakdownData.labels.map((label, i) => {
                    const total = profitBreakdownData.values.reduce((a, b) => a + b, 0)
                    const percentage = total > 0 ? (profitBreakdownData.values[i] / total) * 100 : 0
                    
                    return (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-slate-900">{label}</span>
                          <span className="font-bold" style={{ color: profitBreakdownData.colors[i] }}>
                            {formatCurrency(profitBreakdownData.values[i])}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: profitBreakdownData.colors[i]
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 text-right">{percentage.toFixed(1)}%</p>
                      </div>
                    )
                  })}
                </div>
              </TableCard>
            </div>

            {/* Monthly Revenue Chart */}
            <TableCard title={`Monthly Revenue - ${selectedYear}`} icon={ChartLine}>
              <div className="h-64 flex items-end justify-between gap-2 pt-4">
                {monthlyRevenueData.labels.map((month, i) => {
                  const maxValue = Math.max(...monthlyRevenueData.values)
                  const height = maxValue > 0 ? (monthlyRevenueData.values[i] / maxValue) * 200 : 0
                  
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <div 
                          className="w-full bg-gradient-to-t from-primary to-pink-400 rounded-t-lg transition-all group-hover:opacity-80 cursor-pointer"
                          style={{ height: `${height}px` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {formatCurrency(monthlyRevenueData.values[i])}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{month}</span>
                    </div>
                  )
                })}
              </div>
            </TableCard>

            {/* Top Services */}
            <TableCard title="Top Services by Revenue" icon={Zap}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">#</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Service</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quantity</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profit</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topServices.map((service, i) => (
                      <tr key={service.name} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-400">{i + 1}</td>
                        <td className="py-3 px-4 font-black text-primary">{service.name}</td>
                        <td className="py-3 px-4 text-right font-bold">{formatNumber(service.quantity)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(service.revenue)}</td>
                        <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(service.profit)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatPercentage(service.margin)}</td>
                      </tr>
                    ))}
                    {metrics.topServices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">No service data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            {/* Top Products */}
            <TableCard title="Top Products by Revenue" icon={Package}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">#</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Product</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quantity</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profit</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Margin</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topProducts.map((product, i) => (
                      <tr key={product.name} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-400">{i + 1}</td>
                        <td className="py-3 px-4 font-black text-primary">{product.name}</td>
                        <td className="py-3 px-4 text-right font-bold">{formatNumber(product.quantity)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(product.revenue)}</td>
                        <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(product.profit)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatPercentage(product.margin)}</td>
                        <td className="py-3 px-4 text-right font-bold">{product.stock}</td>
                      </tr>
                    ))}
                    {metrics.topProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">No product data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            {/* Services by Category */}
            <TableCard title="Services by Category" icon={Layers}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Services Sold</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.servicesByCategory.map((cat, i) => (
                      <tr key={cat.category} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{cat.category}</td>
                        <td className="py-3 px-4 text-right font-bold">{cat.count}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(cat.revenue)}</td>
                      </tr>
                    ))}
                    {metrics.servicesByCategory.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500">No category data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            {/* Products by Category */}
            <TableCard title="Products by Category" icon={Box}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Products Sold</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.productsByCategory.map((cat, i) => (
                      <tr key={cat.category} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{cat.category}</td>
                        <td className="py-3 px-4 text-right font-bold">{cat.count}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(cat.revenue)}</td>
                      </tr>
                    ))}
                    {metrics.productsByCategory.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500">No category data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TableCard>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Quotations"
                value={formatNumber(metrics.totalQuotations)}
                icon={FileText}
                subValue={`${formatNumber(metrics.approvedQuotations)} approved (${formatPercentage(metrics.conversionRate)})`}
                color="blue"
              />
              <MetricCard
                title="Jobs"
                value={formatNumber(metrics.totalJobs)}
                icon={Briefcase}
                subValue={`${formatNumber(metrics.completedJobs)} completed`}
                color="green"
              />
              <MetricCard
                title="Clients"
                value={formatNumber(metrics.totalClients)}
                icon={Users}
                subValue={`${formatNumber(metrics.activeClients)} active`}
                color="purple"
              />
              <MetricCard
                title="Employees"
                value={formatNumber(metrics.totalEmployees)}
                icon={HardHat}
                subValue={`Payroll: ${formatCurrency(metrics.totalPayroll)}`}
                color="orange"
              />
            </div>

            {/* Department Costs */}
            <TableCard title="Department Costs" icon={Building}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Department</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Employees</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Total Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Avg Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.departmentCosts.map((dept, i) => (
                      <tr key={dept.department} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{dept.department}</td>
                        <td className="py-3 px-4 text-right font-bold">{dept.count}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(dept.cost)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(dept.cost / dept.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(metrics.totalRevenue)}
                icon={DollarSign}
                color="green"
              />
              <MetricCard
                title="Service Revenue"
                value={formatCurrency(metrics.serviceRevenue)}
                icon={Zap}
                subValue={`Profit: ${formatCurrency(metrics.serviceProfit)}`}
                color="blue"
              />
              <MetricCard
                title="Product Revenue"
                value={formatCurrency(metrics.productRevenue)}
                icon={Package}
                subValue={`Profit: ${formatCurrency(metrics.productProfit)}`}
                color="purple"
              />
              <MetricCard
                title="Job Revenue"
                value={formatCurrency(metrics.jobRevenue)}
                icon={Briefcase}
                subValue={`Profit: ${formatCurrency(metrics.jobProfit)}`}
                color="orange"
              />
            </div>

            <TableCard title="Revenue Breakdown" icon={BarChart3}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Source</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profit</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 font-black text-blue-600">Services</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.serviceRevenue)}</td>
                      <td className="py-3 px-4 text-right font-black text-red-600">{formatCurrency(metrics.serviceCost)}</td>
                      <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(metrics.serviceProfit)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatPercentage(metrics.serviceMargin)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 font-black text-purple-600">Products</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.productRevenue)}</td>
                      <td className="py-3 px-4 text-right font-black text-red-600">{formatCurrency(metrics.productCost)}</td>
                      <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(metrics.productProfit)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatPercentage(metrics.productMargin)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 font-black text-orange-600">Jobs</td>
                      <td className="py-3 px-4 text-right font-black">{formatCurrency(metrics.jobRevenue)}</td>
                      <td className="py-3 px-4 text-right font-black text-red-600">{formatCurrency(metrics.jobCost)}</td>
                      <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(metrics.jobProfit)}</td>
                      <td className="py-3 px-4 text-right font-black">{formatPercentage(metrics.jobMargin)}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-4 px-4 font-black text-slate-900">Total</td>
                      <td className="py-4 px-4 text-right font-black text-primary">{formatCurrency(metrics.totalRevenue)}</td>
                      <td className="py-4 px-4 text-right font-black text-red-600">{formatCurrency(metrics.totalRevenue - metrics.grossProfit)}</td>
                      <td className="py-4 px-4 text-right font-black text-green-600">{formatCurrency(metrics.grossProfit)}</td>
                      <td className="py-4 px-4 text-right font-black">{formatPercentage((metrics.grossProfit/metrics.totalRevenue)*100)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* PROFIT & LOSS TAB */}
        {activeTab === 'profit-loss' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Gross Profit"
                value={formatCurrency(metrics.grossProfit)}
                icon={TrendingUp}
                color="green"
              />
              <MetricCard
                title="Operating Expenses"
                value={formatCurrency(metrics.operatingExpenses)}
                icon={Wallet}
                color="red"
              />
              <MetricCard
                title="Net Profit"
                value={formatCurrency(metrics.netProfit)}
                icon={PiggyBank}
                subValue={`Margin: ${formatPercentage(metrics.profitMargin)}`}
                color="blue"
              />
            </div>

            <TableCard title="Profit & Loss Statement" icon={Calculator}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Revenue</h4>
                  <div className="pl-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Service Revenue</span>
                      <span className="font-black">{formatCurrency(metrics.serviceRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Product Revenue</span>
                      <span className="font-black">{formatCurrency(metrics.productRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Job Revenue</span>
                      <span className="font-black">{formatCurrency(metrics.jobRevenue)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                      <span className="font-black text-slate-900">Total Revenue</span>
                      <span className="font-black text-primary">{formatCurrency(metrics.totalRevenue)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Cost of Goods Sold</h4>
                  <div className="pl-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Service Costs</span>
                      <span className="font-black">{formatCurrency(metrics.serviceCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Product Costs</span>
                      <span className="font-black">{formatCurrency(metrics.productCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Job Costs</span>
                      <span className="font-black">{formatCurrency(metrics.jobCost)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                      <span className="font-black text-slate-900">Total COGS</span>
                      <span className="font-black text-red-600">{formatCurrency(metrics.totalRevenue - metrics.grossProfit)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Gross Profit</h4>
                  <div className="pl-4">
                    <div className="flex justify-between">
                      <span className="font-black text-slate-900">Gross Profit</span>
                      <span className="font-black text-green-600">{formatCurrency(metrics.grossProfit)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-slate-600">Gross Margin</span>
                      <span className="font-black">{formatPercentage((metrics.grossProfit/metrics.totalRevenue)*100)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Operating Expenses</h4>
                  <div className="pl-4 space-y-2">
                    {metrics.departmentCosts.map(dept => (
                      <div key={dept.department} className="flex justify-between">
                        <span className="text-slate-600">{dept.department} Payroll</span>
                        <span className="font-black">{formatCurrency(dept.cost)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                      <span className="font-black text-slate-900">Total Operating Expenses</span>
                      <span className="font-black text-orange-600">{formatCurrency(metrics.operatingExpenses)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-slate-900 text-lg">Net Profit</h4>
                  <div className="pl-4">
                    <div className="flex justify-between">
                      <span className="font-black text-slate-900">Net Profit</span>
                      <span className="font-black text-primary">{formatCurrency(metrics.netProfit)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-slate-600">Net Profit Margin</span>
                      <span className="font-black">{formatPercentage(metrics.profitMargin)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-slate-600">Return on Investment (ROI)</span>
                      <span className="font-black">{formatPercentage(metrics.roi)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TableCard>
          </div>
        )}

        {/* QUOTATIONS TAB */}
        {activeTab === 'quotations' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Quotations"
                value={formatNumber(metrics.totalQuotations)}
                icon={FileText}
                color="blue"
              />
              <MetricCard
                title="Approved"
                value={formatNumber(metrics.approvedQuotations)}
                icon={CheckCircle}
                subValue={formatCurrency(metrics.approvedValue)}
                color="green"
              />
              <MetricCard
                title="Pending"
                value={formatNumber(metrics.pendingQuotations)}
                icon={Clock}
                color="blue"
              />
              <MetricCard
                title="Conversion Rate"
                value={formatPercentage(metrics.conversionRate)}
                icon={Target}
                color="purple"
              />
            </div>

            <TableCard title="Recent Quotations" icon={FileText}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Quote #</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Tax</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Discount</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.slice(0, 10).map(q => (
                      <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{q.quoteNumber}</td>
                        <td className="py-3 px-4 font-medium">{q.client}</td>
                        <td className="py-3 px-4 text-slate-600">{q.date}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(q.total)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(q.taxAmount)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(q.discountAmount)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            q.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            q.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            q.status === 'Draft' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Jobs"
                value={formatNumber(metrics.totalJobs)}
                icon={Briefcase}
                color="purple"
              />
              <MetricCard
                title="Completed"
                value={formatNumber(metrics.completedJobs)}
                icon={CheckCircle}
                subValue={formatCurrency(metrics.jobRevenue)}
                color="green"
              />
              <MetricCard
                title="In Progress"
                value={formatNumber(metrics.inProgressJobs)}
                icon={Activity}
                color="blue"
              />
              <MetricCard
                title="Job Profit"
                value={formatCurrency(metrics.jobProfit)}
                icon={TrendingUp}
                subValue={`Margin: ${formatPercentage(metrics.jobMargin)}`}
                color="emerald"
              />
            </div>

            <TableCard title="Recent Jobs" icon={Briefcase}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Job</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Budget</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Actual Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Profit</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.slice(0, 10).map(job => (
                      <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{job.title}</td>
                        <td className="py-3 px-4 font-medium">{job.client}</td>
                        <td className="py-3 px-4 text-slate-600">{job.scheduledDate}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(job.budget)}</td>
                        <td className="py-3 px-4 text-right font-black text-red-600">{formatCurrency(job.actualCost)}</td>
                        <td className="py-3 px-4 text-right font-black text-green-600">{formatCurrency(job.budget - job.actualCost)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            job.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Clients"
                value={formatNumber(metrics.totalClients)}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Active Clients"
                value={formatNumber(metrics.activeClients)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Client LTV"
                value={formatCurrency(metrics.clientLTV)}
                icon={DollarSign}
                color="purple"
              />
              <MetricCard
                title="Repeat Rate"
                value={formatPercentage(metrics.repeatRate)}
                icon={Target}
                color="orange"
              />
            </div>

            <TableCard title="Top Clients by Revenue" icon={Award}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Company</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Total Spent</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Projects</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topClients.map(client => (
                      <tr key={client.name} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{client.name}</td>
                   
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(client.spent)}</td>
                        <td className="py-3 px-4 text-right font-bold">{client.projects}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            client.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                            client.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                            client.tier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {client.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Employees"
                value={formatNumber(metrics.totalEmployees)}
                icon={Users}
                color="blue"
              />
              <MetricCard
                title="Active Employees"
                value={formatNumber(metrics.activeEmployees)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Total Payroll"
                value={formatCurrency(metrics.totalPayroll)}
                icon={Wallet}
                color="purple"
              />
              <MetricCard
                title="Avg Salary"
                value={formatCurrency(metrics.averageSalary)}
                icon={TrendingUp}
                color="orange"
              />
            </div>

            <TableCard title="Employee List" icon={HardHat}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Department</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Salary</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Rating</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 10).map(emp => (
                      <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{emp.name}</td>
                        <td className="py-3 px-4 font-medium">{emp.department}</td>
                        <td className="py-3 px-4 font-medium">{emp.role}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(emp.salary)}</td>
                        <td className="py-3 px-4 text-right font-black">{emp.rating}/5</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            emp.status === 'Active' ? 'bg-green-100 text-green-700' :
                            emp.status === 'Inactive' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Services"
                value={formatNumber(services.length)}
                icon={Zap}
                color="blue"
              />
              <MetricCard
                title="Active Services"
                value={formatNumber(services.filter(s => s.isActive && s.status === 'ACTIVE').length)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Service Revenue"
                value={formatCurrency(metrics.serviceRevenue)}
                icon={DollarSign}
                color="purple"
              />
            </div>

            <TableCard title="Services List" icon={Zap}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Service</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Price</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Margin</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.slice(0, 10).map(service => (
                      <tr key={service.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{service.name}</td>
                        <td className="py-3 px-4 font-medium">{service.categoryName}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(service.price)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(service.cost)}</td>
                        <td className="py-3 px-4 text-right font-black">{service.profitMargin}%</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            service.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {service.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Products"
                value={formatNumber(products.length)}
                icon={Package}
                color="blue"
              />
              <MetricCard
                title="Active Products"
                value={formatNumber(products.filter(p => p.isActive && p.status === 'ACTIVE').length)}
                icon={CheckCircle}
                color="green"
              />
              <MetricCard
                title="Inventory Value"
                value={formatCurrency(metrics.inventoryValue)}
                icon={Landmark}
                color="purple"
              />
              <MetricCard
                title="Low Stock Items"
                value={formatNumber(metrics.lowStockItems)}
                icon={AlertTriangle}
                color="red"
              />
            </div>

            <TableCard title="Products List" icon={Package}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Product</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Price</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Cost</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Stock</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Min Stock</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 10).map(product => (
                      <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-primary">{product.name}</td>
                        <td className="py-3 px-4 font-medium">{product.categoryName}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(product.price)}</td>
                        <td className="py-3 px-4 text-right font-black">{formatCurrency(product.cost)}</td>
                        <td className="py-3 px-4 text-right font-bold">{product.stock}</td>
                        <td className="py-3 px-4 text-right font-bold">{product.minStock}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b-2 border-slate-200 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Export Report</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'pdf', label: 'PDF', icon: FileText },
                      { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
                      { id: 'csv', label: 'CSV', icon: FileText }
                    ].map(format => (
                      <button
                        key={format.id}
                        onClick={() => setExportFormat(format.id as any)}
                        className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                          exportFormat === format.id
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 hover:border-primary'
                        }`}
                      >
                        <format.icon className={`h-6 w-6 ${
                          exportFormat === format.id ? 'text-primary' : 'text-slate-600'
                        }`} />
                        <span className={`text-xs font-bold ${
                          exportFormat === format.id ? 'text-primary' : 'text-slate-600'
                        }`}>
                          {format.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Include Sections</label>
                  <div className="space-y-2">
                    {['Overview', 'Revenue', 'Profit & Loss', 'Quotations', 'Jobs', 'Clients', 'Employees', 'Services', 'Products'].map(section => (
                      <label key={section} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary focus:ring-primary" />
                        <span className="text-sm font-medium">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Exporting as ${exportFormat.toUpperCase()}...`)
                    setShowExportModal(false)
                  }}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <DownloadCloud className="h-5 w-5" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}