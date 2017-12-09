/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package schedule;

import java.util.List;

/**
 *
 * @author JGotschlich
 */
public class Schedule {

    private static int PLAN_HORIZON = 3;
    

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws Exception {
        
        //Test
        System.out.println("Lets start the heuristic!");

        MongoDBClient client = new MongoDBClient();

        List<Task> tasks = client.readTasks(PLAN_HORIZON);
        System.out.println(tasks.size());
        
        //Add Tasks
        // Task t01= new Task(1 , 2 , 1 , 5 , 5);
        // Task t02= new Task(2 , 2 , 3 , 4 , 3);
        // Task t03= new Task(3 , 3 , 1 , 5 , 3);
        // Task t04= new Task(4 , 2 , 4 , 3 , 3);
        // Task t05= new Task(5 , 1 , 1 , 5 , 4);
        // Task t06= new Task(6 , 2 , 1 , 5 , 1);
        // Task t07= new Task(7 , 1 , 2 , 4 , 5);
        // Task t08= new Task(8 , 2 , 2 , 4 , 4);
        // Task t09= new Task(9 , 4 , 3 , 4 , 2);
        // Task t10= new Task(10 , 5 , 4 , 3 , 1);
        
        //Heuristic Creation
        Heuristic h = new Heuristic(PLAN_HORIZON,tasks.size());
        
        //Create Priritized List
        for (Task t: tasks) {
            h.addTaskPriorizedList(t);
        }

        // h.addTaskPriorizedList(t01);
        // h.addTaskPriorizedList(t02);
        // h.addTaskPriorizedList(t03);
        // h.addTaskPriorizedList(t04);
        // h.addTaskPriorizedList(t05);
        // h.addTaskPriorizedList(t06);
        // h.addTaskPriorizedList(t07);
        // h.addTaskPriorizedList(t08);
        // h.addTaskPriorizedList(t09);
        // h.addTaskPriorizedList(t10);
        
        // Print Task List
        h.printTaskList();
        
        //Add Availability per day
        long [] avail = new long[]{0,8,8,8,8,8,8,8};
        h.addDayInfo(avail);
        
        h.addDayInfo(avail);
        
        
        //Add Days of Execution
        h.assignTaskDates();
        h.greedyHeuristic();
        h.printPlanningHorizon();
        
        /*/MESSAGE TO TAKUYA
        What we need to do with this files is basically:
        1. Create and add the tasks to the List
        2. Add Availability per day
        3. Create Feasible Schedule
        4. Export Data
        
        1,2 and 4 are functional and running
        3 is getting infeasibility in some cases
        
        Methods are;
        1.a. Task t01= new Task(1 , 1 , 1 , 5 , 5);
        1.b. h.addTaskPriorizedList(t01);
        2.
        
        long [] avail = new long[]{0,8,8,6};
        h.addDayInfo(avail);
        
        3. 
        
        h.createSchedule();
        
        4.
        
        h.getTaskList();
        
        Where h is and instance of the Heuristic Class
     
        
        NOTE OTHER CLASSES TO IMPLEMENT:
        import java.util.ArrayList;
        import java.util.Collections;
        import java.util.Comparator;
        
        /*/
        
        
    }
    
}
