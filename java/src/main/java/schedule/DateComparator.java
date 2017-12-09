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
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.util.Comparator;
/**
 *
 * @author https://stackoverflow.com/questions/14475556/how-to-sort-arraylist-of-objects
 * 
 */
public class DateComparator implements Comparator<Task> {
    
    public int compare(Task o1, Task o2) {
    if (o1.getDueDate() > o2.getDueDate()) {
        return -1;
    } else if (o1.getDueDate() < o2.getDueDate()) {
        return 1;
    }
    return 0;
}
    
}