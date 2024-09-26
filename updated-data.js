const projects = [
  {
    title: 'Project A',
    value: 1452, // Total profit/loss
    stages: {
      business_model: {
        completed: true,
        data: {
          businessName: 'Tech Gadgets',
          businessDescription: 'We sell innovative tech gadgets.',
          businessType: 'B2C', // example of other values: B2B, B2C
          targetAudience: 'Frontend developers', // example of other values: Corporate, SMEs, Startups, Individuals
          businessModel: 'sales_per_unit' // example of other values: subscription_sales, sales_per_unit
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
              productionCost: 5,
              sellingPrice: 10,
              subscriptionFrequencies: null // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'PS2',
              type: 'sales_per_unit',
              name: 'Wireless Charger',
              description: 'Fast and efficient wireless chargers.',
              productionCost: 15,
              sellingPrice: 20,
              subscriptionFrequencies: null // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'PS3',
              type: 'subscription_sales',
              name: 'Software Licenses',
              description: 'Comprehensive software licenses.',
              productionCost: 500,
              subscription_price: 1000,
              subscriptionFrequencies: 'monthly' // example of other values: daily, weekly, monthly, annually
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
              name: 'Catia',
              description: 'Software Licenses',
              amount: 10000
            },
            {
              id: 'OTE2',
              name: 'PC Setup',
              description: 'Initial Hardware Setup',
              amount: 5000
            }
          ],
          recurring_expenses: [
            {
              id: 'RE1',
              name: 'Rent',
              description: 'Rent office',
              amount: 1000,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'RE2',
              name: 'Utilities',
              description: 'Utilities electricity',
              amount: 200,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'RE3',
              name: 'Software Licenses',
              description: 'Software Licenses',
              amount: 500,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'RE4',
              name: 'Marketing',
              description: 'Digital Marketing',
              amount: 500,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            },
            {
              id: 'RE5',
              name: 'Salaries',
              description: 'Salaries',
              amount: 1000,
              frequency: 'monthly' // example of other values: daily, weekly, monthly, annually
            }
          ]
        }
      }
      //   simulation: {
      //     completed: true,
      //     data: {
      //       type: 'product_sales',
      //       sales_per_unit: [
      //         {
      //           id: 'PS1',
      //           type: 'sales_per_unit',
      //           name: 'Smartphone Case',
      //           description: 'Durable and stylish smartphone cases.',
      //           productionCost: 5,
      //           sellingPrice: 10,
      //           subscription_frequency: null, // example of other values: daily, weekly, monthly, annually
      //           simulation: {
      //             frequency: 'monthly', // example of other values: daily, weekly, monthly, annually
      //             expected_sales_amount: 100,
      //             start_date: '2022-01-01',
      //             end_date: '2023-30-06',
      //             expected_sales_range: 0.2
      //           }
      //         },
      //         {
      //           id: 'PS2',
      //           type: 'sales_per_unit',
      //           name: 'Wireless Charger',
      //           description: 'Fast and efficient wireless chargers.',
      //           productionCost: 15,
      //           sellingPrice: 20,
      //           subscription_frequency: null, // example of other values: daily, weekly, monthly, annually
      //           simulation: {
      //             frequency: 'monthly', // example of other values: daily, weekly, monthly, annually
      //             expected_sales_amount: 100,
      //             start_date: '2022-01-01',
      //             end_date: '2023-30-06',
      //             expected_sales_range: 0.2
      //           }
      //         }
      //       ],
      //       //! This is an example of a subscription sales simulation - i need to know if i should use range on expected subscription increment or subscription_amount themselves.
      //       subscription_sales: [
      //         {
      //           id: 'PS3',
      //           type: 'subscription_sales',
      //           name: 'Software Licenses',
      //           description: 'Comprehensive software licenses.',
      //           productionCost: 500,
      //           subscription_price: 1000,
      //           subscription_frequency_payment: 'biweekly', // example of other values: daily, weekly, monthly, annually
      //           simulation: {
      //             frequency_subscription_rotation_data: 'monthly', // example of other values: daily, weekly, monthly, annually
      //             starting_subscription_amount: 60,
      //             expected_subscription_increment_data: {
      //               start_date: '2022-01-01',
      //               end_date: '2023-31-07', // example of other values: null,
      //               increment_type: 'percentage', // example of other values: fixed_amount, percentage
      //               expected_subscription_increment: 0.05,
      //               expected_subscription_decreasment: 0.01
      //             },
      //             expected_subscriptios_range: 0.01
      //           }
      //         }
      //       ]
      //     }
      //   },
      //   businessPlan: {
      //     completed: true,
      //     data: {
      //       additional_information: 'Focusing on expanding the product line.',
      //       request_improvement_suggestions: true,
      //       business_model: 'product_sales'
      //     }
      //   }
      // },
      // chartOptions: {
      //   colors: ['#34C28F', '#556EE5'], // Colors for revenue and expenses
      //   chart: {
      //     id: 'project_a_chart',
      //     sparkline: {
      //       enabled: true
      //     }
      //   },
      //   stroke: {
      //     curve: 'smooth'
      //   },
      //   markers: {
      //     size: 0
      //   },
      //   xaxis: {
      //     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] // Example categories
      //   }
      // },
      // chartData: [
      //   {
      //     name: 'Revenue',
      //     data: [30, 40, 35, 50, 49, 60, 70] // Revenue data
      //   },
      //   {
      //     name: 'Expenses',
      //     data: [20, 30, 25, 40, 39, 50, 60] // Expenses data
      //   }
      // ]
    }
  }
]
