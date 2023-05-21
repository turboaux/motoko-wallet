import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Transfer } from '../../shared/models/transfer';

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.scss']
})
export class TransferFormComponent implements OnInit {

  @Input() userBalance: number = 0;
  @Input() userPrincipal: string = '';
  @Input() loading: boolean = false;
  @Output() onSend: EventEmitter<Partial<Transfer>> = new EventEmitter<Partial<Transfer>>();
  @Output() onUpdateAmountToTransfer: EventEmitter<number> = new EventEmitter<number>();
  @Output() onUpdateTargetPrincipal: EventEmitter<string> = new EventEmitter<string>();
  
  public transferForm!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    
    this.transferForm = this.fb.group({
      amountToTransfer: [null, [Validators.required, Validators.min(1), Validators.max(this.userBalance)]],
      targetPrincipal: ['', Validators.required]
    });
  }

  send(): void {

    this.transferForm.markAllAsTouched();

    if (this.transferForm.valid) {

      this.onSend.emit(this.transferForm.value as Partial<Transfer>);
    }
  }

  updateAmountToTransfer(amount: number): void {

    if (this.amountToTransferIsInvalid) {

      return;
    }

    this.onUpdateAmountToTransfer.emit(amount);
  }

  updateTargetPrincipal(principal: string): void {

    if (this.targetPrincipalIsInvalid) {

      return;
    }

    this.onUpdateTargetPrincipal.emit(principal);
  }

  get amountToTransfer() {
    return this.transferForm.get('amountToTransfer');
  }

  get amountToTransferIsInvalid() {
    return this.amountToTransfer?.invalid && (this.amountToTransfer?.dirty || this.amountToTransfer?.touched);
  }

  get amountToTransferIsRequired() {
    return this.amountToTransfer?.hasError('required');
  }

  get amountToTransferTooSmall() {
    return this.amountToTransfer?.hasError('min');
  }

  get amountToTransferNotEnough() {
    return this.amountToTransfer?.hasError('max');
  }

  get targetPrincipal() {
    return this.transferForm.get('targetPrincipal');
  }

  get targetPrincipalIsInvalid () {
    return this.targetPrincipal?.invalid && (this.targetPrincipal?.dirty || this.targetPrincipal?.touched);
  }

  get targetPrincipalIsRequired() {
    return this.targetPrincipal?.hasError('required');
  }
}
