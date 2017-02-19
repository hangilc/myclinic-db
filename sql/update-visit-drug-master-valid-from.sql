update visit_drug, visit v, iyakuhin_master_arch m
	set visit_drug.d_master_valid_from = m.valid_from 
	where visit_drug.visit_id = v.visit_id
	and visit_drug.d_iyakuhincode = m.iyakuhincode 
	and m.valid_from <= date(v.v_datetime)
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime));