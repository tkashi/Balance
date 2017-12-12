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
        
        //Add (Dummy) Tasks 
        // Task(int id2, int duration2, int dueDate2, int urgency2, int importance2)
        // List<Task> tasks = new ArrayList<>();
        // tasks.add(new Task(1 , 2 , 1 , 5 , 5));
        // tasks.add(new Task(2 , 2 , 3 , 4 , 3));
        // tasks.add(new Task(3 , 3 , 1 , 5 , 3));
        // tasks.add(new Task(4 , 2 , 4 , 3 , 3));
        // tasks.add(new Task(5 , 1 , 1 , 5 , 4));
        // tasks.add(new Task(6 , 2 , 1 , 5 , 1));
        // tasks.add(new Task(7 , 1 , 2 , 4 , 5));
        // tasks.add(new Task(8 , 2 , 2 , 4 , 4));
        // tasks.add(new Task(9 , 4 , 3 , 4 , 2));
        // tasks.add(new Task(10 , 5 , 4 , 3 , 1));
        
        //Heuristic Creation
        Heuristic h = new Heuristic(PLAN_HORIZON,tasks.size());
        
        //Create Priritized List
        for (Task t: tasks) {
            h.addTaskPriorizedList(t);
        }
        
        // Print Task List
        h.printTaskList();
        
        //Add Availability per day
        int studyHours = 8;
                
        int [] avail = new int[PLAN_HORIZON + 1];
        int[] totalOurs = client.readTotalHoursPerDate(1, PLAN_HORIZON);  // new long[]{0,8,8,8,8,8,8,8};
        for (int i = 1; i <= PLAN_HORIZON; i++) {
        		avail[i] = studyHours - totalOurs[i];
        }
        h.addDayInfo(avail);
        
        //Add Days of Execution
        h.assignTaskDates();
        h.greedyHeuristic();
        h.printPlanningHorizon();   
    }
    
}
