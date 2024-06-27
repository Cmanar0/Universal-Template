import { VDatePickerHeader } from 'vuetify/components'

const projects = [
  {
    title: 'Project A',
    value: 1452, // Total profit/loss
    stages: {
      business_model: {
        completed: true,
        data: {
          business_name: 'Tech Gadgets',
          business_description: 'We sell innovative tech gadgets.',
          business_type: 'B2C', // example of other values: B2B, B2C
          target_audience: 'Frontend developers', // example of other values: Corporate, SMEs, Startups, Individuals
          target_location: 'Global', // example of other values: Local, National, International
          countries: ['United States', 'Canada', 'Germany'],
          city: 'New York',
          business_model: 'sales_per_unit' // example of other values: subscription_sales, sales_per_unit
        }
      },
      revenue_products: {
        completed: true,
        data: {
          items: [
            {
              id: 'PS1',
              type: 'sales_per_unit',
              name: 'Smartphone Case',
              description: 'Durable and stylish smartphone cases.',
              production_cost: 5,
              selling_price: 10,
              subscription_frequency: null // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'PS2',
              type: 'sales_per_unit',
              name: 'Wireless Charger',
              description: 'Fast and efficient wireless chargers.',
              production_cost: 15,
              selling_price: 20,
              subscription_frequency: null // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'PS3',
              type: 'subscription_sales',
              name: 'Software Licenses',
              description: 'Comprehensive software licenses.',
              production_cost: 500,
              subscription_price: 1000,
              subscription_frequency: 'biweekly' // example of other values: daily, weekly, monthly, annually
            }
          ]
        }
      },
      expenses: {
        completed: true,
        data: {
          one_time_expenses: [
            {
              id: 'OTE1',
              description: 'Equipment',
              amount: 10000
            },
            {
              id: 'OTE2',
              description: 'Initial Inventory',
              amount: 5000
            }
          ],
          recurring_expenses: [
            {
              id: 'RE1',
              description: 'Rent',
              amount: 1000,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'RE2',
              description: 'Utilities',
              amount: 200,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'RE3',
              description: 'Software Licenses',
              amount: 500,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'RE4',
              description: 'Marketing',
              amount: 500,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'RE5',
              description: 'Salaries',
              amount: 1000,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            }
          ]
        }
      },
      simulation: {
        completed: true,
        data: {
          type: 'product_sales',
          sales_per_unit: [
            {
              id: 'PS1',
              type: 'sales_per_unit',
              name: 'Smartphone Case',
              description: 'Durable and stylish smartphone cases.',
              production_cost: 5,
              selling_price: 10,
              subscription_frequency: null, // example of other values: daily, weekly, monthly, annually
              simulation: {
                frequency: 'monthly', // example of other values: daily, weekly, monthly, annually
                expected_sales_amount: 100,
                start_date: '2022-01-01',
                end_date: '2023-30-06',
                expected_sales_range: 0.2
              }
            },
            {
              id: 'PS2',
              type: 'sales_per_unit',
              name: 'Wireless Charger',
              description: 'Fast and efficient wireless chargers.',
              production_cost: 15,
              selling_price: 20,
              subscription_frequency: null, // example of other values: daily, weekly, monthly, annually
              simulation: {
                frequency: 'monthly', // example of other values: daily, weekly, monthly, annually
                expected_sales_amount: 100,
                start_date: '2022-01-01',
                end_date: '2023-30-06',
                expected_sales_range: 0.2
              }
            }
          ],
          //! This is an example of a subscription sales simulation - i need to know if i should use range on expected subscription increment or subscription_amount themselves.
          subscription_sales: [
            {
              id: 'PS3',
              type: 'subscription_sales',
              name: 'Software Licenses',
              description: 'Comprehensive software licenses.',
              production_cost: 500,
              subscription_price: 1000,
              subscription_frequency_payment: 'biweekly', // example of other values: daily, weekly, monthly, annually
              simulation: {
                frequency_subscription_rotation_data: 'monthly', // example of other values: daily, weekly, monthly, annually
                starting_subscription_amount: 60,
                expected_subscription_increment_data: {
                  start_date: '2022-01-01',
                  end_date: '2023-31-07', // example of other values: null,
                  increment_type: 'percentage', // example of other values: fixed_amount, percentage
                  expected_subscription_increment: 0.05,
                  expected_subscription_decreasment: 0.01
                },
                expected_subscriptios_range: 0.01
              }
            }
          ]
        }
      },
      businessPlan: {
        completed: true,
        data: {
          additional_information: 'Focusing on expanding the product line.',
          request_improvement_suggestions: true,
          business_model: 'product_sales'
        }
      }
    },
    chartOptions: {
      colors: ['#34C28F', '#556EE5'], // Colors for revenue and expenses
      chart: {
        id: 'project_a_chart',
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] // Example categories
      }
    },
    chartData: [
      {
        name: 'Revenue',
        data: [30, 40, 35, 50, 49, 60, 70] // Revenue data
      },
      {
        name: 'Expenses',
        data: [20, 30, 25, 40, 39, 50, 60] // Expenses data
      }
    ]
  },
  {
    title: 'Project B',
    value: null, // No profit calculated yet
    change: null, // No change available
    isSimulationGenerated: false, // Simulation data not yet generated
    isProfitable: false, // Not determined yet
    stages: {
      businessModel: {
        completed: true,
        data: {
          business_name: 'SaaS Platform',
          business_description: 'We provide a cloud-based project management tool.',
          business_type: 'B2B',
          target_market: 'Small and medium enterprises',
          business_model: 'subscription_sales'
        }
      },
      productService: {
        completed: false,
        data: null // Not completed yet
      },
      expenses: {
        completed: false,
        data: null // Not completed yet
      },
      margins: {
        completed: false,
        data: null // Not completed yet
      },
      simulation: {
        completed: false,
        data: null // Not completed yet
      },
      businessPlan: {
        completed: false,
        data: null // Not completed yet
      }
    },
    chartOptions: null, // No chart options yet
    chartData: null // No chart data yet
  },
  {
    title: 'Project C',
    value: -500, // Annual loss
    change: '-0.3%', // Change in value or loss
    isSimulationGenerated: true, // Simulation data is generated
    isProfitable: false, // Project is not profitable
    stages: {
      businessModel: {
        completed: true,
        data: {
          business_name: 'Consulting Services',
          business_description: 'We offer IT consulting services.',
          business_type: 'B2B',
          target_market: 'Large enterprises',
          business_model: 'subscription_sales'
        }
      },
      productService: {
        completed: true,
        data: {
          type: 'subscription_sales',
          items: [
            {
              name: 'IT Support',
              description: 'Monthly IT support and maintenance.',
              development_cost: 0,
              licensing_cost: 200
            },
            {
              name: 'Cloud Services',
              description: 'Subscription-based cloud services.',
              development_cost: 5000,
              licensing_cost: 1000
            }
          ]
        }
      },
      expenses: {
        completed: true,
        data: {
          one_time_expenses: [
            {
              description: 'Office Setup',
              amount: 20000
            },
            {
              description: 'Marketing',
              amount: 5000
            }
          ],
          recurring_expenses: [
            {
              description: 'Salaries',
              amount: 10000,
              frequency: 'monthly'
            },
            {
              description: 'Software Licenses',
              amount: 500,
              frequency: 'monthly'
            }
          ]
        }
      },
      margins: {
        completed: true,
        data: {
          type: 'subscription_sales',
          items: [
            {
              subscription_name: 'IT Support',
              subscription_price: 500,
              margin: 300
            },
            {
              subscription_name: 'Cloud Services',
              subscription_price: 1000,
              margin: 500
            }
          ]
        }
      },
      simulation: {
        completed: true,
        data: {
          type: 'subscription_sales',
          items: [
            {
              subscription_name: 'IT Support',
              initial_subscriptions: 50,
              growth_rate: 5, // 5% growth rate
              growth_type: 'linear'
            },
            {
              subscription_name: 'Cloud Services',
              initial_subscriptions: 20,
              growth_rate: 10, // 10% growth rate
              growth_type: 'linear'
            }
          ]
        }
      },
      businessPlan: {
        completed: true,
        data: {
          additional_information: 'Exploring new markets to increase subscriptions.',
          request_improvement_suggestions: true,
          business_model: 'subscription_sales'
        }
      }
    },
    chartOptions: {
      colors: ['#34C28F', '#F46969'], // Colors for revenue and expenses (red for loss)
      chart: {
        id: 'project_c_chart',
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] // Example categories
      }
    },
    chartData: [
      {
        name: 'Revenue',
        data: [10, 20, 15, 25, 24, 30, 35] // Revenue data
      },
      {
        name: 'Expenses',
        data: [30, 40, 35, 50, 49, 60, 70] // Expenses data
      }
    ]
  }
]

console.log(projects)
