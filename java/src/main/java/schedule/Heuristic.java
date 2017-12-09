/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package schedule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
/**
 *
 * @author JGotschlich
 */
public class Heuristic {
    
    // Parameter
  private int planHorizon;
  private int taskNum;
 
  // Variables
  public ArrayList <Task> taskList;
  private long dailyCap[];
  private long dailyAvail[];
  private long cumDailyAvail[];
  
  public Heuristic(int planHorizon, int numberTasks){
     this.planHorizon=planHorizon;
     this.taskNum = 0;
     this.dailyAvail = new long[planHorizon+1];
     this.dailyCap = new long[planHorizon+1];
     this.cumDailyAvail = new long[planHorizon+1];
     this.taskList = new ArrayList();
     
}
 
  public void greedyHeuristic(){
      
      boolean feasible= false;
      
      for(int i=1; i<=100 & feasible==false; i++){
          feasible = this.createSchedule();
      }
  }
      
  /** Create Feasible Schedule based on priority. If priority schedule is 
   * infeasible, it increases the importance of the late tasks. Return true if schedule is feasible */
  
  public boolean createSchedule(){
        
        //Get the first task late
        int e= this.firstElementLate();
        System.out.println();
        System.out.println("==============================");
        System.out.println("Initiating schedule creation..." );
        System.out.println("Element Late Task id "+ this.taskList.get(e).getId() +" in position "+e);

        //Improve the priority of the task 
        this.upTaskImportance(e);
        //Sort Task by priority
        this.sortTaskList();
        // Assign every task with an specific date
        this.assignTaskDates();
        // Sort the task by day and later with priority
        this.sortTaskListByDay();

        this.printTaskList();
        this.printDayInfo();
        
        boolean feas = this.isFeasible();
        System.out.println("Feasibility: "+ feas);
        return (feas);
        
        
        
  }
  
  /** Get the ArrayList with the Tasks */
  public ArrayList getTaskList(){
      return this.taskList;
  }
  
  // ================  ADD INFORMATION TO THE HEURISTIC ==============
  
  /**Add tasks to the TaskList */
  public void addTask(Task newTask){
      this.taskList.add(newTask);
      this.taskNum++;
  }
  
  /**Add tasks to the TaskList adding them by priority. Listed from position 0 
   and with decreasing priority*/
  public void addTaskPriorizedList(Task newTask){
      if(this.taskList.isEmpty()){
          this.taskList.add(newTask);
          this.taskNum++;
          System.out.println("Task " + this.taskList.get(0).getId()+ " added to position " + 0);
          return;
          
      } else {
          for(int i=0;i<this.taskList.size();i++) {
                if(newTask.getPriority() > this.taskList.get(i).getPriority()){
                    this.taskList.add(i, newTask);
                    this.taskNum++;
                    System.out.println("Task " + this.taskList.get(i).getId()+ " added to position " + i);
                    return;
                 }
            }
          
        this.taskList.add(newTask);
        System.out.println("Task " + newTask.getId()+ " added to last position ");
        this.taskNum++;
        return; 
      }
  }
  
  /**Add information about the daily priority for the planning horizon
   Receives a long array with a length of "p+1"*/
  
  public void addDayInfo(long [] avail){
      long cum = 0;
      for(int i=1; i<=this.planHorizon;i++){
            this.dailyAvail[i]=avail[i];
            this.dailyCap[i]=avail[i];
            this.cumDailyAvail[i]= cum + avail[i];
            cum = cum + avail[i];
        }
  }
  
  
  // ================  ASSIGN TASK DATES ==============
  /**Assign Dates to Task regarding the order of appearance in the TaskList*/
  
  public void assignTaskDates(){
        
        this.resetDailyAvail();
        // Assignning Days to Every Task considering the first open spot for prioritized tasklist
        System.out.println("Initiating Task Assign...");
        for(int i=0;i<this.taskList.size();i++){
            boolean assigned=false;
            for(int j=1; j<=this.planHorizon & assigned==false; j++){
                if(this.taskList.get(i).getDuration()<=this.dailyAvail[j]){
                    this.taskList.get(i).setTaskDay(j);
                    this.dailyAvail[j] = this.dailyAvail[j] - this.taskList.get(i).getDuration();
                    assigned=true;
                    System.out.println("Task " + this.taskList.get(i).getId() 
                            + " assigned to Day" + j + " (Avail: " + this.dailyAvail[j]+")");
                    
                    
                } 
            }
            if(assigned==false){
                this.taskList.get(i).setTaskDay(-1);
                System.out.println("Task " + this.taskList.get(i).getId()+ " assigned to day -1");
                    
            }
      }
  }
  
  public void resetDailyAvail(){
      
      long cum=0;
      for(int i=1; i<=this.planHorizon ; i++){
          this.dailyAvail[i]=this.dailyCap[i];
          this.cumDailyAvail[i]= cum + this.dailyCap[i];
          cum = cum + this.dailyCap[i];
      }
  }
  
  
  
  // ================  METHODS TO ENSURE TIME CONSTRAINTS ==============
  
  /**Increases task priority to meet DueDate by increasing the importance of the task*/
  
  public void upTaskImportance(int position){
      
    //Find lowest priority task of the due date
    System.out.println("Increasing Importance of Task " + this.taskList.get(position).getId() + "...");
    int dueDate = (int)this.taskList.get(position).getDueDate();
    int lowestPriorityTask=0;
    boolean assigned=false;
    
    System.out.println("Cumulative Capacity:" + Arrays.toString(this.cumDailyAvail));
   
    
    long cumAux=0;
    for(int i=0;i<this.taskList.size() & assigned==false; i++){
        cumAux= cumAux + this.taskList.get(i).getDuration();
        if(cumAux+this.taskList.get(position).getDuration()>this.cumDailyAvail[dueDate]){
            lowestPriorityTask = i;
            assigned=true;
        }
    }
    
    /*/for(int i=0;i<this.taskList.size();i++){
          if(this.taskList.get(i).getTaskDay()==dueDate){
              if(!assigned){
                  lowestPriorityTask = i;
                  assigned = true;
              } else {
                  if(this.taskList.get(i).getPriority()< 
                          this.taskList.get(lowestPriorityTask).getPriority()){
                      lowestPriorityTask = i;
                  }
              }
          }
    }/*/
    
    //Assign the lowest importance to be included in the day
    int imp = (int) (this.taskList.get(lowestPriorityTask).getPriority()/this.taskList.get(position).getUrgency());  
    if(this.taskList.get(lowestPriorityTask).getPriority() != imp*this.taskList.get(position).getUrgency()){
        imp++;
    }
    this.taskList.get(position).setImportance(imp);
    
    // Update Priority
    int aux = this.taskList.get(position).getImportance()*this.taskList.get(position).getUrgency();
    this.taskList.get(position).setPriority(aux);
    System.out.println("Updated Task- ID: " + this.taskList.get(position).getId()
            +"  Urg:"+ + this.taskList.get(position).getUrgency() 
            +"  Imp:"+ this.taskList.get(position).getImportance() 
            +"  Pri:"+ this.taskList.get(position).getPriority());
    
    
  }
  
  private boolean taskExist(int position){
      if(position<this.taskList.size()){
          if(this.taskList.get(position)!=null){
              return true;
          }
      }
      return false;
  }
  
  /**Return the true is schedule is feasible 0*/
  public boolean isFeasible(){
      if( this.firstElementLate()==(-1)){
          return true;
      } else {
      return false;
  }
  
      /**Return the first element in the List which does not meet the due date constraint
   Return (-1) if there is no late elements. Elements are numerated from position 0*/
  
  }
  
  /**Return the index of the first element to be out of schedule 0*/
  public int firstElementLate(){
      for(int i=0;i<this.taskList.size();i++){
          if(this.taskList.get(i).getDueDate()<this.taskList.get(i).getTaskDay()){
              return i;
          }
      }
      return (-1);
  }
  
  
  public void sortTaskList(){
      //Collections.sort(taskList, new PriorityComparator());
      taskList.sort(Comparator.comparing(Task::getPriority).reversed().thenComparing(Task::getDueDate));
  }
  
  public void sortTaskListByDay(){
      //Collections.sort(taskList, new PriorityComparator());
      taskList.sort(Comparator.comparing(Task::getTaskDay).reversed().thenComparing(Task::getPriority).reversed().thenComparing(Task::getDueDate));
  }
  
  public void sortTaskListByDueDate(boolean descendent){
      if(descendent){
          Collections.sort(taskList, new DateComparator());
      } else {
          Collections.sort(taskList, new DateComparator().reversed());
      }
        
  }
  //
  // ================  PRINT INFORMATION ==============
  
  public void printTaskList(){
      System.out.println();
      System.out.println("ID  Dur Due Urg Imp Pri Day");
      for(int i=0;i<this.taskList.size();i++){
          this.taskList.get(i).printTaskInfo();
      }
      System.out.println();
  }
  
  public void printDayInfo(){
      System.out.println();
      System.out.println("Day  Cap  Usage  Avail");
      for(int i=1;i<=this.planHorizon;i++){
          System.out.print(i + "    " +this.dailyCap[i]);
          System.out.print("    " +(this.dailyCap[i] - this.dailyAvail[i]));
          System.out.print("      " +this.dailyAvail[i]);
          System.out.println();
      }
      System.out.println();
  }
  
  
  public void printPlanningHorizon(){
      for(int i=1;i<=this.planHorizon;i++){
          System.out.println(" ==== Task List for Day " + i + " ====");
          for(int t=0;t<this.taskList.size();t++){
              if(this.taskList.get(t).getTaskDay()==i){
                  System.out.println("Task " + this.taskList.get(t).getId()+ " Priority:" + this.taskList.get(t).getPriority());
              }  
            }
          System.out.println();
        }
  }
  
}
