select d.drug_id, d.d_iyakuhincode, m.iyakuhincode from (visit v inner join visit_drug d on v.visit_id = d.visit_id )
	left outer join iyakuhin_master_arch m 
	on d.d_iyakuhincode = m.iyakuhincode 
	and m.valid_from <= date(v.v_datetime) 
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime))
	where m.iyakuhincode is null
	;

select d.drug_id, count(*) as c from visit_drug d, visit v, iyakuhin_master_arch m
	where d.visit_id = v.visit_id and d.d_iyakuhincode = m.iyakuhincode
	and m.valid_from <= date(v.v_datetime) 
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime))
	group by d.drug_id, d.d_iyakuhincode
	having c != 1
	;