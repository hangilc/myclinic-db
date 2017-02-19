select s.shinryou_id, s.shinryoucode, m.shinryoucode from (visit v inner join visit_shinryou s on v.visit_id = s.visit_id )
	left outer join shinryoukoui_master_arch m 
	on s.shinryoucode = m.shinryoucode 
	and m.valid_from <= date(v.v_datetime) 
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime))
	where m.shinryoucode is null
	;

select s.shinryou_id, count(*) as c from visit v, visit_shinryou s, shinryoukoui_master_arch m 
	where s.visit_id = v.visit_id 
	and s.shinryoucode = m.shinryoucode
	and m.valid_from <= date(v.v_datetime) 
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime))
	group by s.shinryou_id, s.shinryoucode, m.shinryoucode
	having c != 1 
	;

-- 111000110 初診　=> 111003610 初診（診療所）
-- 160700110 尿一般 => 160000310 尿一般 (or delete)
-- 160700210 潜血（便） => 160005210 潜血（便） (or delete)

