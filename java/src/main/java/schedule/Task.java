/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package schedule;

/**
 *
 * @author JGotschlich
 */
public class Task {
    
    // atributes
  private String id;
  private long duration;
  private double dueDate;
  private int urgency;
  private int importance;
  private int priority;
  private boolean modify;
  private int taskDay;
  
  //constructor
  public Task(String id2, int duration2, double dueDate2, int urgency2, int importance2){
  
  this.id=id2;
  this.duration=duration2;
  this.dueDate=dueDate2;
  this.urgency=urgency2;
  this.importance=importance2;
  
  this.priority= urgency2*importance2;
  this.modify = false;
  this.taskDay=0;
  
  }
  
  // Print Methods
  
  public void printTaskInfo(){
      
      System.out.print(this.id +"   ");
      System.out.print(this.duration +"   ");
      System.out.print(this.dueDate +"   ");
      System.out.print(this.urgency +"   ");
      System.out.print(this.importance +"   ");
      System.out.print(this.priority +"   ");
      System.out.println(this.taskDay +"   ");
      
      
  }
  
  
  //Set and Gets Methods
  
    public String getId(){
      return this.id;
    }

    public long getDuration(){
      return this.duration;
    }

    public double getDueDate(){
      return this.dueDate;
    }

    public int getUrgency(){
      return this.urgency;
    }

    public int getImportance(){
      return this.importance;
    }

    public int getPriority(){
      return this.priority;
    }

    public long getTaskDay() {
      return this.taskDay;
    }
   
    public void setId(String id) {
        this.id = id;
        this.modify=true;
    }

    public void setDuration(int duration) {
        this.duration = duration;
        this.modify=true;
    }

    public void setDueDate(double dueDate) {
        this.dueDate = dueDate;
        this.modify=true;
    }

    public void setUrgency(int urgency) {
        this.urgency = urgency;
        this.modify=true;
    }

    public void setImportance(int importance) {
        this.importance = importance;
        this.modify=true;
    }

    public void setPriority(int priority) {
        this.priority = priority;
        this.modify=true;
    }

    public void setTaskDay(int taskDay) {
        this.taskDay = taskDay;
        this.modify=true;
    }
  
   
    
    
}
