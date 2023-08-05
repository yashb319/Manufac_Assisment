interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
  }
  
  interface IEmployeeOrgApp {
    ceo: Employee;
    move(employeeID: number, supervisorID: number): void;
    undo(): void;
    redo(): void;
  }
  
  class EmployeeOrgApp implements IEmployeeOrgApp {
    ceo: Employee;
    private history: { action: string; data: any }[];
    private currentIndex: number;
  
    constructor(ceo: Employee) {
      this.ceo = ceo;
      this.history = [];
      this.currentIndex = -1;
    }
  
    move(employeeID: number, supervisorID: number): void {
      const employee = this.findEmployee(this.ceo, employeeID);
      const employeeManager = this.findParent(this.ceo, employeeID);
      const newSupervisor = this.findEmployee(this.ceo, supervisorID);
  
      if (employee && newSupervisor && employeeManager) {
        
        this.addToHistory("move", { employeeID: employeeID, employee : employee, employeeSubordinate : employee.subordinates, oldSupervisor : employeeManager, newSupervisor : newSupervisor });

        //Remove the employee from its manager
        employeeManager.subordinates = employeeManager.subordinates.filter(
          (subordinate) => subordinate.uniqueId !== employeeID
        );

        //push employee subMember to it parent
        employee.subordinates.map((sub) =>{
            employeeManager.subordinates.push(sub);
        })

        //empty the employee subMember
        employee.subordinates = [];

        //pub employee to new manager
        newSupervisor.subordinates.push(employee);
      }
    }
  
    undo(): void {
        if (this.currentIndex >= 0) {
          const { action, data } = this.history[this.currentIndex];
          switch (action) {
            case "move":
              const { employeeID, employee, employeeSubordinate, oldSupervisor, newSupervisor } = data;

              //Remove the employee from its new manager
              newSupervisor.subordinates = newSupervisor.subordinates.filter(
                    (sub: { uniqueId: any; }) => sub.uniqueId !== employeeID
                );

            //Remove the employeeOriginalSubordinate from its old manager
            employeeSubordinate.map((emp: { uniqueId: any; }) =>{
                oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
                    (sub: { uniqueId: any; }) => sub.uniqueId !== emp.uniqueId
                );
            });


            employee.subordinates = employeeSubordinate;

            oldSupervisor.subordinates.push(employee);

              break;
            default:
              break;
          }
          this.currentIndex--;
        }
      }

    redo(): void {

      if (this.currentIndex < this.history.length - 1) {
        this.currentIndex++;
        const { action, data } = this.history[this.currentIndex];

        console.log("redo");
        console.log(data);
        
        switch (action) {
            case "move":
              const { employeeID, employee, employeeSubordinate, oldSupervisor, newSupervisor } = data;

            //Remove the employee from its manager
            oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
            (subordinate: { uniqueId: any; }) => subordinate.uniqueId !== employeeID
          );
  
          //push employee subMember to it parent
          employeeSubordinate.map((sub: any) =>{
            oldSupervisor.subordinates.push(sub);
          })
  
          //empty the employee subMember
          employee.subordinates = [];
  
          //pub employee to new manager
          newSupervisor.subordinates.push(employee);

              break;
            default:
              break;
          }
      }
    }
  
    private addToHistory(action: string, data : any): void {
      this.history = this.history.slice(0, this.currentIndex + 1); 
      this.history.push({ action, data });
      this.currentIndex++;
    }
  
    private findEmployee(root: Employee, employeeID: number): Employee | null {
      if (root.uniqueId === employeeID) {
        return root;
      }
      for (const subordinate of root.subordinates) {
        const foundEmployee = this.findEmployee(subordinate, employeeID);
        if (foundEmployee) {
          return foundEmployee;
        }
      }
      return null;
    }

    private findParent(root: Employee, employeeID: number): Employee | null {
        for (const subordinate of root.subordinates) {
          if (subordinate.uniqueId === employeeID) {
            return root;
          }
          const result = this.findParent(subordinate, employeeID);
          if (result) {
            return result;
          }
        }
        return null;
    }
  }
  

  // Org mapping
  const ceo: Employee = {
    uniqueId: 1,
    name: 'John Smith',
    subordinates: [
      {
        uniqueId: 2,
        name: 'Margot Donald',
        subordinates: [
          {
            uniqueId: 3,
            name: 'Cassandra Reynolds',
            subordinates: [
              {
                uniqueId: 4,
                name: 'Mary Blue',
                subordinates: [],
              },
              {
                uniqueId: 5,
                name: 'Bob Saget',
                subordinates: [
                  {
                    uniqueId: 6,
                    name: 'Tina Teff',
                    subordinates: [
                      {
                        uniqueId: 7,
                        name: 'Will Turner',
                        subordinates: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        uniqueId: 8,
        name: 'Tyler Simpson',
        subordinates: [
          {
            uniqueId: 9,
            name: 'Harry Tobs',
            subordinates: [
              {
                uniqueId: 10,
                name: 'Thomas Brown',
                subordinates: [],
              },
            ],
          },
          {
            uniqueId: 11,
            name: 'George Carrey',
            subordinates: [],
          },
          {
            uniqueId: 12,
            name: 'Gary Styles',
            subordinates: [],
          },
        ],
      },
      {
        uniqueId: 13,
        name: 'Ben Willis',
        subordinates: [],
      },
      {
        uniqueId: 14,
        name: 'Georgina Flangy',
        subordinates: [
          {
            uniqueId: 15,
            name: 'Sophie Turner',
            subordinates: [],
          },
        ],
      },
    ],
  };





const app = new EmployeeOrgApp(ceo);
console.log(JSON.stringify(app.ceo, null, 2));
app.move(5, 11);

app.move(6, 12);
console.log(JSON.stringify(app.ceo, null, 2));
app.undo();
console.log(JSON.stringify(app.ceo, null, 2));
app.redo();
console.log(JSON.stringify(app.ceo, null, 2));
