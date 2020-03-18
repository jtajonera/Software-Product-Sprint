// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Queue;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.Comparator;
import java.util.ArrayList;
import java.util.List;


// A meeting request has:
// a name
// a duration in minutes
// a collection of attendees

// For a particular time slot to work, all attendees must be free to attend the meeting. When a query is made, it will be given a collection of all known events. Each event has:
// a name
// a time range
// a collection of attendees
// A time range will give you the start time, the end time, and the duration of the event. If you want to know more, open the TimeRange.java file.

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
      //Gets info on request
      Collection<String> attendees = request.getAttendees();
      long dur = request.getDuration();
      if(dur > TimeRange.END_OF_DAY - TimeRange.START_OF_DAY || dur < 0){
          return new ArrayList<>(); //Special case where there can be no meetings of that duration 
      }
      //Find busy times of each person attending event
      List<TimeRange> busyTimes = new ArrayList<>();
      for(Event e : events){ //looks at every event
          Collection<String> eventAtt = e.getAttendees();
          for(String a : eventAtt){ //looks at all the people attending the event
                System.out.println(a + eventAtt.size() + " " + attendees.contains(a));
              if(attendees.contains(a)){
                  System.out.println("Goes in");
                  busyTimes.add(e.getWhen());
                  break; //found someone in this event, we can stop searching this one
              }
          }

      }
      List<TimeRange> tr = new ArrayList(); 

      //Assume whole day is free at first
    tr.add(TimeRange.WHOLE_DAY);
    Collections.sort(busyTimes, TimeRange.ORDER_BY_START); //sort the busy times by start date for easier parsing
        for(TimeRange e : busyTimes){
            int origLen = tr.size();
            for(int i = 0; i < origLen; i ++){
                TimeRange freeTime = tr.get(i);
                if(tr.get(i).contains(e)){ //remove fully, split free by e
                    TimeRange secHalf = TimeRange.fromStartDuration(e.end(), freeTime.end() - e.end());
                    TimeRange firstHalf = TimeRange.fromStartDuration(freeTime.start(), freeTime.duration() - secHalf.duration() - e.duration());
                    tr.remove(freeTime); //remove old time
                    i--; //back the counter up because we removed an item
                    origLen --; //we need to view one less item
                    if(firstHalf.duration() >= dur) //only add to list if the free time >= duration wanted
                        tr.add(firstHalf);
                    if(secHalf.duration() >= dur)
                        tr.add(secHalf);
                } else if(freeTime.overlaps(e)){ //starts are the same, but ends arent, cut free by some amount
                    int newStart = 0;
                    int newEnd = 0;
                    //There are two cases, if the free time occurs before or after the busy time
                    if(freeTime.start() < e.start()){
                        newStart = freeTime.start();
                        newEnd = freeTime.duration() - (freeTime.end() - e.start());//freeTime.end() - (freeTime.end() - e.start());
                    } else {
                        newStart = e.end();
                        newEnd = freeTime.duration() - (e.end() - freeTime.start());
                    }
                    TimeRange cutTime = TimeRange.fromStartDuration(newStart, newEnd);
                    tr.remove(freeTime);
                    i--; //back the counter up because we removed an item
                    origLen --; //we need to view one less item
                    if(cutTime.duration() >= dur)
                    tr.add(cutTime);
                }
            }
        }
    Collections.sort(tr, TimeRange.ORDER_BY_START); //Order by start times
      Collection<TimeRange> collTr = tr; //Cast to a Collection
      return collTr; 
  }
}
