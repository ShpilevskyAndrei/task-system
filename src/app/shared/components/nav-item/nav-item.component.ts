import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { INav } from '../side-menu/side-menu-navs';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [NgIf, RouterLink, NgClass],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
})
export class NavItemComponent {
  @Input({ required: true }) nav!: INav;
  @Input() isActive = false;
}
