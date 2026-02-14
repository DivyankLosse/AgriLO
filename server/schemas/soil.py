from pydantic import BaseModel
from typing import Dict, Any, Optional

class SoilDataInput(BaseModel):
    ph: float
    moisture: float
    nitrogen: int
    phosphorus: int
    potassium: int
    temperature: Optional[float] = 25.0
    rainfall: Optional[float] = 100.0

class SoilResponse(BaseModel):
    status: str
    data: Dict[str, Any]
