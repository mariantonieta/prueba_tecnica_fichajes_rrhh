from enum import Enum

class UserRole(str, Enum):
    RRHH = 'RRHH'
    EMPLOYEE = 'EMPLOYEE'
    
class RecordTypeEnum(str, Enum):
    CHECK_IN = "CHECK_IN"
    CHECK_OUT = "CHECK_OUT"
    
class AdjustmentTypeEnum(str, Enum):
    ENTRY_CORRECTION = "ENTRY_CORRECTION"
    EXIT_CORRECTION = "EXIT_CORRECTION"
    MANUAL_ENTRY = "MANUAL_ENTRY"
    OTHER = "OTHER"    
class AdjustmentStatusEnum(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class LeaveTypeEnum(str, Enum):
    VACATION = "VACATION"
    SICK = "SICK"
    PERSONAL = "PERSONAL"
    OTHER = "OTHER"

class LeaveStatusEnum(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
