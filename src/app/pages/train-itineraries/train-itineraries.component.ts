import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchFormData } from '../../components/train-itineraries-search/train-itineraries-search.interfaces';
import { TrainItinerariesService, TrainItinerariesResponse, itinerary } from '../../services/train-itineraries/train-itineraries.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-train-itineraries',
  templateUrl: './train-itineraries.component.html',
  styleUrls: ['./train-itineraries.component.scss']
})
export class TrainItinerariesPageComponent implements OnInit {

  /**
   * Search form that will be submitted by the user
   */
  public searchForm: SearchFormData = {
    originLocation: "",
    destinationLocation: ""
  };

  public responseSearchId: string;  
  public itineraries: itinerary[]= [];

  constructor(private trainItinerariesService: TrainItinerariesService, router: Router,private _snackBar: MatSnackBar) {
    this.responseSearchId="";
    const destinationLocation = router.getCurrentNavigation()?.extras.state?.['destinationLocation'];
    if (destinationLocation) {
      this.searchForm.destinationLocation = destinationLocation;
    }
  }

  ngOnInit(): void {      
  }


  /**
   * Search for flights matching the SearchPageComponent search form
   */
  onSearch() {
    console.log('Searching for ', this.searchForm.originLocation, this.searchForm.destinationLocation);
    
    //Call Service
    this.trainItinerariesService.getTrainItineraries(this.searchForm.originLocation, this.searchForm.destinationLocation)
    .then(this.updateSearchResults.bind(this))
    .catch(this.handleError.bind(this));

    
  }

  updateSearchResults(response: TrainItinerariesResponse){
    const responseData = response?.data;
    console.log("RailKit: Full Response from RailKitAPI: ",responseData)
    console.log("RailKit: returned searchID : ",responseData.id)
    this.responseSearchId = responseData.id;
    this.itineraries = responseData.itineraries;
   
    this._snackBar.open('Search successfull. Returned search ID  : ' + this.responseSearchId, 'OK');
  }

  handleError(err: string){
    console.log("ERROR : " + err)
    this._snackBar.open('Search FAILED. Check console', 'OK');
  }


}
