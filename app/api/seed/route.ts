import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Department from '@/lib/models/Department';
import KPI from '@/lib/models/KPI';
import Notification from '@/lib/models/Notification';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      KPI.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // Create admin user
    const admin = new User({
      email: 'admin@kpimanager.com',
      password: 'admin123',
      firstName: 'System',
      lastName: 'Admin',
      role: 'Admin',
    });
    await admin.save();

    // Create departments
    const salesDept = new Department({
      name: 'Sales',
      description: 'Sales and Business Development',
      managerId: admin._id,
      color: '#3B82F6',
    });
    await salesDept.save();

    const marketingDept = new Department({
      name: 'Marketing',
      description: 'Marketing and Customer Acquisition',
      managerId: admin._id,
      color: '#10B981',
    });
    await marketingDept.save();

    const operationsDept = new Department({
      name: 'Operations',
      description: 'Operations and Process Management',
      managerId: admin._id,
      color: '#F59E0B',
    });
    await operationsDept.save();

    // Create manager and staff users
    const salesManager = new User({
      email: 'manager@kpimanager.com',
      password: 'manager123',
      firstName: 'John',
      lastName: 'Smith',
      role: 'Manager',
      department: salesDept._id,
    });
    await salesManager.save();

    const salesStaff = new User({
      email: 'staff@kpimanager.com',
      password: 'staff123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'Staff',
      department: salesDept._id,
    });
    await salesStaff.save();

    const marketingStaff = new User({
      email: 'marketing@kpimanager.com',
      password: 'marketing123',
      firstName: 'Mike',
      lastName: 'Davis',
      role: 'Staff',
      department: marketingDept._id,
    });
    await marketingStaff.save();

    const operationsStaff = new User({
      email: 'operations@kpimanager.com',
      password: 'operations123',
      firstName: 'Emily',
      lastName: 'Brown',
      role: 'Staff',
      department: operationsDept._id,
    });
    await operationsStaff.save();

    // Update department managers
    salesDept.managerId = salesManager._id;
    await salesDept.save();

    // Create sample KPIs
    const kpis = [
      // Sales KPIs
      {
        title: 'Monthly Revenue Target',
        description: 'Achieve monthly revenue target of $100,000',
        targetValue: 100000,
        currentValue: 75000,
        unit: '$',
        deadline: new Date('2025-01-31'),
        priority: 'Critical',
        assignedTo: salesStaff._id,
        departmentId: salesDept._id,
        createdBy: salesManager._id,
        category: 'Revenue',
      },
      {
        title: 'New Customer Acquisition',
        description: 'Acquire 50 new customers this month',
        targetValue: 50,
        currentValue: 32,
        unit: 'customers',
        deadline: new Date('2025-01-31'),
        priority: 'High',
        assignedTo: salesStaff._id,
        departmentId: salesDept._id,
        createdBy: salesManager._id,
        category: 'Growth',
      },
      {
        title: 'Sales Conversion Rate',
        description: 'Maintain conversion rate above 15%',
        targetValue: 15,
        currentValue: 18,
        unit: '%',
        deadline: new Date('2025-02-28'),
        priority: 'Medium',
        assignedTo: salesManager._id,
        departmentId: salesDept._id,
        createdBy: admin._id,
        category: 'Performance',
      },
      // Marketing KPIs
      {
        title: 'Website Traffic Growth',
        description: 'Increase website traffic by 25%',
        targetValue: 25,
        currentValue: 15,
        unit: '%',
        deadline: new Date('2025-02-15'),
        priority: 'High',
        assignedTo: marketingStaff._id,
        departmentId: marketingDept._id,
        createdBy: admin._id,
        category: 'Growth',
      },
      {
        title: 'Social Media Engagement',
        description: 'Achieve 5000 social media engagements',
        targetValue: 5000,
        currentValue: 3200,
        unit: 'engagements',
        deadline: new Date('2025-01-31'),
        priority: 'Medium',
        assignedTo: marketingStaff._id,
        departmentId: marketingDept._id,
        createdBy: admin._id,
        category: 'Engagement',
      },
      // Operations KPIs
      {
        title: 'Customer Satisfaction Score',
        description: 'Maintain customer satisfaction above 90%',
        targetValue: 90,
        currentValue: 87,
        unit: '%',
        deadline: new Date('2025-02-28'),
        priority: 'Critical',
        assignedTo: operationsStaff._id,
        departmentId: operationsDept._id,
        createdBy: admin._id,
        category: 'Quality',
      },
      {
        title: 'Order Processing Time',
        description: 'Reduce average order processing time to 2 hours',
        targetValue: 2,
        currentValue: 2.5,
        unit: 'hours',
        deadline: new Date('2025-01-31'),
        priority: 'High',
        assignedTo: operationsStaff._id,
        departmentId: operationsDept._id,
        createdBy: admin._id,
        category: 'Efficiency',
      },
    ];

    for (const kpiData of kpis) {
      const kpi = new KPI(kpiData);
      await kpi.save();

      // Create some history entries
      kpi.history.push({
        value: kpiData.currentValue * 0.6,
        comment: 'Initial progress update',
        updatedBy: kpiData.assignedTo,
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      });
      
      kpi.history.push({
        value: kpiData.currentValue,
        comment: 'Latest progress update',
        updatedBy: kpiData.assignedTo,
        updatedAt: new Date(),
      });
      
      await kpi.save();
    }

    // Create sample notifications
    const notifications = [
      {
        type: 'KPI_THRESHOLD',
        title: 'KPI Below Target',
        message: 'Monthly Revenue Target is currently at 75% completion',
        userId: salesStaff._id,
        priority: 'High',
      },
      {
        type: 'KPI_OVERDUE',
        title: 'KPI Deadline Approaching',
        message: 'New Customer Acquisition deadline is in 3 days',
        userId: salesStaff._id,
        priority: 'Medium',
      },
      {
        type: 'KPI_COMPLETED',
        title: 'KPI Completed',
        message: 'Sales Conversion Rate target has been achieved',
        userId: salesManager._id,
        priority: 'Low',
      },
    ];

    for (const notificationData of notifications) {
      const notification = new Notification(notificationData);
      await notification.save();
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      data: {
        users: 5,
        departments: 3,
        kpis: kpis.length,
        notifications: notifications.length,
      },
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}