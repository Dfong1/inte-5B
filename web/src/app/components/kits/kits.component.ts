import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kits',
  standalone: true,
  imports: [],
  templateUrl: './kits.component.html',
  styleUrl: './kits.component.css'
})
export class KitsComponent implements OnInit{

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }

}
